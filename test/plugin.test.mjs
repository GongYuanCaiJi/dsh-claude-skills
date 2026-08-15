// dsh-claude-skills — plugin install-contract tests (#37)
//
// Seam under test: the public dsh-plugin contract that `dsh plugin add` relies
// on — package.json shape, the cordis.patch.yml skill-filesystem registration,
// and the discoverability contract of every registered skill root
// (`<root>/<name>/SKILL.md` with dsh-parseable frontmatter).
//
// The patch expression resolves URLs against the profile directory
// (`baseUrl`), where the package lands at `node_modules/dsh-claude-skills/`.
// To verify from a fresh clone (where the package is the repo itself), each
// patch dir is stripped of its `node_modules/dsh-claude-skills/` prefix and
// asserted against the repository root. A wrong URL or a missing skills dir
// therefore fails these tests.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import YAML from 'yaml';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const pkg = JSON.parse(readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));

const PATCH_DIR_PREFIX = `node_modules/${pkg.name}/`;

/**
 * Resolve a patch customSkillDir the way the bundle does, relative to repo root.
 * The patch value is the dsh cordis `!!js` expression
 * `process.getBuiltinModule('node:url').fileURLToPath(new URL('<dir>', baseUrl))`
 * where baseUrl is the profile directory; the package lands at
 * `node_modules/<name>/`. Extract the URL literal and re-root it at the repo.
 */
function resolvePatchDir(rawValue) {
  const m = /new URL\('([^']+)',\s*baseUrl\)/.exec(String(rawValue));
  assert.ok(m, `customSkillDir must be a profile-relative new URL() expression: ${rawValue}`);
  const rawUrl = m[1];
  assert.match(rawUrl, new RegExp(`^node_modules/${pkg.name}/`),
    `customSkillDir must live under node_modules/${pkg.name}/: ${rawUrl}`);
  return path.join(repoRoot, rawUrl.slice(PATCH_DIR_PREFIX.length));
}

function listSkillDirs(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && existsSync(path.join(dir, e.name, 'SKILL.md')))
    .map((e) => e.name);
}

function loadPatch() {
  const patchPath = path.join(repoRoot, pkg.dsh?.bundle?.patch ?? 'cordis.patch.yml');
  assert.ok(existsSync(patchPath), 'cordis.patch.yml must exist');
  const doc = YAML.parse(readFileSync(patchPath, 'utf8'));
  assert.ok(Array.isArray(doc) && doc.length > 0, 'patch must be a non-empty list');
  return doc;
}

test('package.json declares the dsh plugin contract', () => {
  assert.equal(pkg.name, 'dsh-claude-skills');
  assert.equal(pkg.license, 'MIT');
  assert.ok(pkg.description.includes('alirezarezvani/claude-skills'),
    'description must name the upstream');
  assert.ok(pkg.repository?.url?.includes('github.com/GongYuanCaiJi/dsh-claude-skills'),
    'repository must point at this repo');
  assert.ok(pkg.homepage, 'homepage required');
  assert.ok(pkg.bugs?.url, 'bugs required');
  assert.ok(Array.isArray(pkg.keywords) && pkg.keywords.includes('dsh-plugin'), 'dsh-plugin keyword required');
  assert.ok(pkg.scripts?.test, 'test script required for clean-clone installs');
  assert.equal(pkg.dsh?.bundle?.patch, './cordis.patch.yml');
  // dsh 依赖必须钉死确切版本（playbook Y4：^0.1.0-rc.6 会随 0.x 脱钩）
  assert.equal(pkg.dependencies?.['@deepseek-ai/dsh-skill-filesystem'], '0.1.0-rc.6',
    'dsh-skill-filesystem must be pinned to the exact next-tag version');
});

test('cordis.patch.yml registers a skill-filesystem instance with resolvable roots', () => {
  const doc = loadPatch();
  const insert = doc.flatMap((op) => op.insert ?? []);
  assert.ok(insert.length >= 1, 'patch must contain at least one insert');

  const fsRows = insert.filter((r) => r.name === '@deepseek-ai/dsh-skill-filesystem');
  assert.equal(fsRows.length, 1, 'exactly one skill-filesystem row expected');
  const row = fsRows[0];
  assert.equal(row.config.includeDefaultRoots, false,
    'must not re-scan default user/project roots');
  assert.ok(row.config.providerName, 'providerName required');
  assert.ok(Array.isArray(row.config.customSkillDirs) && row.config.customSkillDirs.length > 0,
    'customSkillDirs required');

  for (const dirUrl of row.config.customSkillDirs) {
    const dir = resolvePatchDir(dirUrl);
    assert.ok(existsSync(dir), `registered skill root must exist: ${dirUrl} -> ${dir}`);
    assert.ok(statSync(dir).isDirectory(), `registered skill root must be a directory: ${dirUrl}`);
    const skills = listSkillDirs(dir);
    assert.ok(skills.length >= 1, `registered root must contain at least one <name>/SKILL.md: ${dirUrl}`);
  }
});

test('every registered skill root yields only dsh-discoverable, valid skills', () => {
  const doc = loadPatch();
  const row = doc
    .flatMap((op) => op.insert ?? [])
    .find((r) => r.name === '@deepseek-ai/dsh-skill-filesystem');
  const registered = [];
  for (const dirUrl of row.config.customSkillDirs) {
    const dir = resolvePatchDir(dirUrl);
    for (const name of listSkillDirs(dir)) {
      registered.push({ name, file: path.join(dir, name, 'SKILL.md') });
    }
  }

  // 穷举覆盖契约：规范树里每一份 SKILL.md（除一个测试夹具）都必须能从某个
  // 注册根单层发现。patch 漏注册任何技能都会在这里炸 —— 之前正是这样漏掉了
  // engineering/minimalist、engineering/strict-api、loop-library。
  const CROSS_TOOL = new Set(['.codex', '.gemini', '.hermes', '.vibe']);
  const FIXTURE = 'engineering/skills/skill-tester/assets/sample-skill/SKILL.md';
  const canonical = [];
  (function walk(dir) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name === '.git') continue;
      if (e.isSymbolicLink()) continue; // 跨工具转换树的 symlink，非规范内容
      if (CROSS_TOOL.has(e.name)) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name === 'SKILL.md') canonical.push(full);
    }
  })(repoRoot);
  const canonicalSet = new Set(canonical);
  assert.equal(canonical.length, 362, `canonical tree must hold 362 SKILL.md, got ${canonical.length}`);

  const registeredSet = new Set(registered.map((r) => r.file));
  assert.equal(registered.length, 361, `expected 361 registered skills, got ${registered.length}`);
  for (const rel of canonical) {
    if (rel === path.join(repoRoot, FIXTURE)) {
      assert.ok(!registeredSet.has(rel), 'test fixture must NOT be registered');
    } else {
      assert.ok(registeredSet.has(rel), `every canonical SKILL.md must be registered: ${path.relative(repoRoot, rel)}`);
    }
  }

  // 上游数据瑕疵（100% 原样复制，不改）：这两个 frontmatter 在 description 的 plain
  // scalar 内含 `: `（如 "Precedence: project"），dsh 用的 yaml 套件（skill-filesystem
  // README 明载）会整条拒绝 → 这两个 skill 在 dsh 目录中消失并警告。清单钉死，数量
  // 有界；若上游修好，此清单要跟着缩。
  const KNOWN_BAD_FRONTMATTER = new Set([
    'markdown-html/skills/design-system/SKILL.md',
    'markdown-html/skills/md-slides/SKILL.md',
  ]);
  const bad = [];
  for (const { name, file } of registered) {
    const raw = readFileSync(file, 'utf8');
    assert.match(raw, /^---\n/m, `SKILL.md must start with frontmatter: ${file}`);
    const fmText = raw.slice(4, raw.indexOf('\n---', 4));
    const rel = path.relative(repoRoot, file);
    if (KNOWN_BAD_FRONTMATTER.has(rel)) continue;
    let fm;
    try {
      fm = YAML.parse(fmText);
    } catch (err) {
      bad.push(`${rel} :: ${err.message.split('\n')[0]}`);
      continue;
    }
    // 上游不保证 frontmatter name 等于目录名（实查一处：playwright-pro/skills/pw 的
    // frontmatter name 是 playwright-pro）—— dsh 契约只要求 name 为 kebab-case 且
    // description 存在；100% 原样复制规则禁止我们改上游内容，所以测契约不测目录名。
    assert.match(fm.name, /^[a-z0-9]+(-[a-z0-9]+)*$/, `name must be kebab-case: ${file}`);
    assert.equal(typeof fm.description, 'string', `description must be a string: ${file}`);
    assert.ok(fm.description.length > 0, `description must be non-empty: ${file}`);
  }
  assert.deepEqual(bad, [], `unexpected frontmatter parse failures: ${bad.join('; ')}`);
});

test('upstream marketplace.json parses (verbatim integrity spot check)', () => {
  const mkt = JSON.parse(readFileSync(path.join(repoRoot, '.claude-plugin/marketplace.json'), 'utf8'));
  assert.ok(Array.isArray(mkt.plugins) && mkt.plugins.length >= 80, 'marketplace plugins expected');
  for (const p of mkt.plugins) {
    assert.ok(p.name && p.source, 'every marketplace plugin needs name+source');
  }
});
