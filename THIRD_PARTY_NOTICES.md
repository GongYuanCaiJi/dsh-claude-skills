# THIRD PARTY NOTICES

`dsh-claude-skills` is a **port**（移植）of the upstream MIT-licensed project
[`alirezarezvani/claude-skills`](https://github.com/alirezarezvani/claude-skills).
All skill content (SKILL.md bodies, Python tools, references, templates,
docs) is preserved **verbatim** from the pinned upstream revision; only the
DSH plugin layer (package.json, package-lock.json, cordis.patch.yml,
test/plugin.test.mjs), this repo's README, THIRD_PARTY_NOTICES.md itself,
and the LICENSE header were added by the port. Three upstream-committed
subtrees are **not shipped** (`engineering-team/playwright-pro/integrations/`,
`engineering/skills/skill-tester/tests/`, `standards/documentation/`):
upstream's own `.gitignore` marks them maintainer-only, and the port import
follows it — see the full deviations list below. See [README.md](./README.md).

## Upstream

| | |
|---|---|
| Project | [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) |
| License | MIT — `Copyright (c) 2025 Alireza Rezvani` |
| Pinned revision | `aa8d778811a557a2c28ccadda4cf3d0bd028a4cc` (branch `main`, 2026-07-17) |
| Marketplace version | `2.11.2` (`.claude-plugin/marketplace.json` `metadata.version`) |
| Tarball (codeload, pinned commit) | `https://codeload.github.com/alirezarezvani/claude-skills/tar.gz/aa8d778811a557a2c28ccadda4cf3d0bd028a4cc` |

## Bundled third-party components

Five in-tree subtrees are third-party components, each carrying its own MIT
LICENSE (license-compatible, retained in place — components themselves are
untouched). Individually itemized per OSS eligibility criterion D1.

| 元件路徑 (path) | 版權持有人 (copyright holder) | 授權 (license) | LICENSE 檔位置 (in-repo location) |
|---|---|---|---|
| `engineering-team/playwright-pro` | © 2026 Reza Rezvani | MIT | `engineering-team/playwright-pro/LICENSE` |
| `engineering-team/self-improving-agent` | © 2026 Reza Rezvani | MIT | `engineering-team/self-improving-agent/LICENSE` |
| `engineering/collab-proof` | © 2026 dong7812 | MIT | `engineering/collab-proof/LICENSE` |
| `engineering/skillopt-sleep` | © 2026 Microsoft Corporation | MIT | `engineering/skillopt-sleep/LICENSE` |
| `loop-library` | © 2026 Forward Future | MIT | `loop-library/LICENSE` |

## Tarball fingerprints (pinned revision)

| Algorithm | Value |
|---|---|
| `gitHead` | `aa8d778811a557a2c28ccadda4cf3d0bd028a4cc` |
| SHA-1 (`shasum`) | `0c97188efe371754765463b106ab7dabc650215e` |
| SHA-256 | `ac8bdd2d6b7383e9d844e65dc153e07968cfca807e7651877d4c8b199dadab77` |
| SHA-512 (npm `integrity` base64) | `2wSnM45UJDwkeUdxdEBIjVpUV+5azulIFeRJi+m8X6PW6XXP2l52GWs8z0Nu0R7avuUHm3fGqnkJw3wOjL7t+w==` |

Verify the whole tree against the pinned upstream:

```bash
curl -L https://codeload.github.com/alirezarezvani/claude-skills/tar.gz/aa8d778811a557a2c28ccadda4cf3d0bd028a4cc \
  | shasum -a 256
# expect: ac8bdd2d6b7383e9d844e65dc153e07968cfca807e7651877d4c8b199dadab77
```

## Verbatim files — SHA-256 spot checks

The following files are shipped byte-for-byte from upstream (same revision
above). `README.md` / `LICENSE` / `.gitignore` / `.github/workflows/` / the
upstream-gitignored `integrations/`, `tests/`, and `documentation/` subtrees
are intentional deviations, and `package.json` / `package-lock.json` /
`cordis.patch.yml` / `test/plugin.test.mjs` / `THIRD_PARTY_NOTICES.md` are
port-added files that do not exist upstream (see the full list below).

| SHA-256 | File |
|---|---|
| `ee6ffd75e19eaf1b8b729c6c401fb27c1b24d62f33afafc281669f2819128867` | `README.md`（上游原档，见下方「替代」说明） |
| `a20126646f93d32a8989c3cf4772d59194f405034f7babe7daebeac22b8ab151` | `LICENSE`（上游原档，见下方「替代」说明） |
| `71e3342f4c87741b0681234d6cb788932a4595e287b9d51269ca8223fb2330fa` | `SKILL_PIPELINE.md` |
| `67537d2d7d4307875af1b66e9cf7a1448f532f941e3b0305cc4b28d8acb8469b` | `.claude-plugin/marketplace.json` |
| `fde41aeb8b9977e85e33a69140c9d5aac099698f480bac6c89a9a5ef8baca8bc` | `engineering/skills/chaos-engineering/SKILL.md` |
| `c2b1fe51416b7e4e951ce55072d937c4c5783b92573c88714c58e27cefa862fe` | `marketing-skill/skills/aeo/SKILL.md` |
| `90903dec123f1ab3d4f570f920d41f57dee5e008a0fc547c4d15e184d676c4c8` | `scripts/sync-codex-skills.py` |
| `c2f5150603e23144cb4933376be02f0289bb29bd1d628c35acbd8bc74c969558` | `assets/icon.png` |

Compare any file to upstream:

```bash
curl -sL https://raw.githubusercontent.com/alirezarezvani/claude-skills/aa8d778811a557a2c28ccadda4cf3d0bd028a4cc/<path> \
  | shasum -a 256        # expect the value above
# e.g. curl -sL https://raw.githubusercontent.com/alirezarezvani/claude-skills/aa8d778811a557a2c28ccadda4cf3d0bd028a4cc/engineering/skills/chaos-engineering/SKILL.md | shasum -a 256
```

## Intentional deviations from upstream (the full list)

Every deviation is deliberate, is listed here, and is described in the
delivery report for issue #37. Everything else is byte-identical to the
pinned revision.

| Path | Deviation | Why it is required |
|---|---|---|
| `README.md` | Replaced with the port's own bilingual README | Upstream README documents the upstream repo's own install paths (`/plugin marketplace add alirezarezvani/...`); keeping it would mislead dsh users. Upstream hash pinned above. |
| `LICENSE` | Added port copyright line `Copyright (c) 2026 GongYuanCaiJi (dsh port)` | MIT notice requires the port's copyright alongside the upstream's; pure copyright lines keep GitHub license detection at `MIT`. |
| `package.json` | Created by the port (upstream has **no** `package.json`) | Playbook Y2 (diff upstream scripts one by one) is vacuous here — nothing to diff. The port adds only a `test` script (no build step exists, so `prepare`/`prepublishOnly`/`types` do not apply; `dsh plugin add` from git needs no build). Rationale recorded in the delivery report #37. |
| `package-lock.json` | Created by the port (`npm install` generated; upstream has no `package.json`, hence no lockfile) | Reproducible `npm ci` installs for clean-clone verification (playbook machine check 1). |
| `test/plugin.test.mjs` | Created by the port (upstream has **no** `test/` directory) | Verifies the dsh plugin install contract (package.json shape, patch roots, skill discoverability, frontmatter validity) — the `npm test` that machine check 1 runs. |
| `THIRD_PARTY_NOTICES.md` | Created by the port (this file) | Playbook N4: pins the upstream revision and hashes so the verbatim claim is self-verifiable. |
| `.gitignore` | Playbook safety lines merged at top | Production-line requirement (`node_modules/`, `dist/`, `.serena/`, `*.log`, `.env*`, `*.tgz`, `.upstream/`); upstream's own rules kept below. |
| `.github/workflows/` | Not shipped (12 files) | Upstream CI is wired to the upstream repo's own secrets/backends: `release.yml` auto-tags and auto-creates GitHub Releases on every CHANGELOG-touching push to `main`, `sync-codex-skills.yml` rewrites `main` content, `claude-*` workflows require the upstream maintainer's Claude Code subscription (OIDC). Running them on this repo would auto-publish the upstream's release versions under this org — misleading attribution. Skill content is unaffected. |
| `engineering-team/playwright-pro/integrations/` | Not shipped (10 files: `browserstack-mcp/` + `testrail-mcp/` TypeScript MCP servers) | Excluded by upstream's own `.gitignore` (`integrations/` — "Generated integration files"); upstream commits them despite the ignore, and the port import follows the ignore. Consumed only by upstream's Claude Code `.mcp.json`, which dsh does not consume. |
| `engineering/skills/skill-tester/tests/` | Not shipped (1 file: `test_security_scorer.py`) | Excluded by upstream's own `.gitignore` (`tests/` — "Pytest suite (maintainer quality gate; not user-consumable)"). |
| `standards/documentation/` | Not shipped (2 files: `.gitkeep`, `documentation-standards.md`) | Excluded by upstream's own `.gitignore` (`documentation/` — "Internal dev artifacts (maintainer-only — hidden from cloners)"). |
