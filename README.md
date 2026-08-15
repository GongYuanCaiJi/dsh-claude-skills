# 🧠 dsh-claude-skills

[English](#english) · [中文](#中文)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Skills](https://img.shields.io/badge/Skills-362-brightgreen?style=for-the-badge)](#功能)
[![Upstream](https://img.shields.io/badge/upstream-claude--skills-blue?style=for-the-badge)](https://github.com/alirezarezvani/claude-skills)
[![DSH plugin](https://img.shields.io/badge/DSH-plugin-8257D0?style=for-the-badge)](https://github.com/topics/dsh-plugin)

> **362 个 Claude Code 技能库，移植（port）进 DeepSeek Harness —— 工程、产品、营销、
> 合规、C-level 咨询、研究与日常生产力的开箱即用技能包。**
> 技能正文与上游 [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills)
> 逐字一致，原样保留，一字未改。

## 中文

### 功能

- 📦 **362 个技能、88 个插件域**：工程（含 25 个 POWERFUL 进阶技能）、产品、营销
  （含 AEO 引擎优化）、监管与质量、C-level 顾问（完整 C-suite）、研究（litreview /
  grants / patent / deep-research 等）、生产力（capture / reflect / handoff /
  deep-work / meetings）、金融、商业运营与增长、Markdown→HTML 等 18 个领域。
- 🐍 **658 个 Python 工具**（规范树内 .py 文件实测；上游 marketplace 宣称 644）：绝大多数 stdlib-only；少数技能需要 pip 依赖（PyYAML、torch/onnx、PIL、requests/bs4/pandas、firecrawl，见对应技能说明）。
- 🧩 **SKILL.md 原生格式**：每个技能是 `<name>/SKILL.md` 目录包（正文 + scripts +
  references + assets），dsh 按标准发现。
- 🔒 **自带 Skill Security Auditor**：安装前扫描技能的命令注入 / 数据外送 / 提示注入。

### 效果

安装后所有技能进入 dsh 的全局技能层，在任何 dsh 界面（Web / TUI / headless）都能按名调用：

```
Using the senior-architect skill, review our microservices architecture
and identify the top 3 scalability risks.
```

### 安装

仓库未发布到 npm，用 GitHub 安装（git 安装可能触发 pnpm 的 build-script 白名单；
若被拦截，`dsh` 会打印要补到该 profile 的 `pnpm-workspace.yaml` `allowBuilds`
下的确切 key，补上后重跑同一条命令即可。本包无构建步骤，多数环境不需要）：

```bash
dsh plugin --profile <name> add github:GongYuanCaiJi/dsh-claude-skills
```

本地路径安装（先 `npm install`）：

```bash
git clone https://github.com/GongYuanCaiJi/dsh-claude-skills.git
cd dsh-claude-skills && npm install
dsh plugin --profile <name> add .
```

### 使用

技能按领域分目录保留（`engineering/skills/`、`marketing-skill/skills/`……），
dsh 的发现规则是单层 `<root>/<name>/SKILL.md`，因此每个领域目录都是一个注册根。
安装后直接按技能名调用即可；不知道用哪个时，让模型浏览技能目录或直接描述任务。

### 已知边界

- 数量口径：**362** 是上游宣称的技能数（本仓库规范树里也确实有 362 份 SKILL.md）。
  本插件实际注册 **361** 个（88 个注册根，穷举覆盖，测试强制）；其中 2 个
  （`markdown-html/skills/design-system`、`md-slides`）的 frontmatter 含 dsh YAML
  解析器不接受的写法（上游数据瑕疵，逐字保留不修），dsh 会在发现时警告并跳过，
  所以**可用技能 359** 个。
- 上游另有给其他 agent 的转换树（`.codex/`、`.gemini/`、`.hermes/`、`.vibe/`），
  本插件不注册它们 —— 那是给别的工具用的副本，注册会造成目录重复。
- 上游的 Claude Code 专属机制（`commands/` 斜杠命令、`.claude/agents/` 子代理、
  `.claude-plugin/` marketplace）原样保留但 dsh 不消费，详见交付报告 #37。

### License

MIT。技能内容 © 2025 [Alireza Rezvani](https://github.com/alirezarezvani/claude-skills)
（上游）—— **请也给上游点个 star** ⭐；移植层 © 2026 GongYuanCaiJi。
完整出处与上游哈希见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。

---

## English

> **362 Claude Code skills ported into DeepSeek Harness** — a ready-to-use skill
> pack for engineering, product, marketing, compliance, C-level advisory,
> research, and daily productivity.
> Skill bodies are **verbatim** from upstream
> [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) — unchanged.

### Features

- 📦 **362 skills across 88 plugin domains / 18 areas**: engineering (incl. 25
  POWERFUL-tier), product, marketing (incl. AEO), regulatory & QM, C-level
  advisory (full C-suite), research (litreview / grants / patent /
  deep-research…), productivity (capture / reflect / handoff / deep-work /
  meetings), finance, business operations & growth, markdown→HTML, and more.
- 🐍 **658 Python tools** (counted from `.py` files in the canonical tree; upstream marketplace claims 644): mostly stdlib-only; a few skills need pip dependencies (PyYAML, torch/onnx, PIL, requests/bs4/pandas, firecrawl — see each skill's docs).
- 🧩 **Native SKILL.md format**: each skill is a `<name>/SKILL.md` bundle
  (body + scripts + references + assets), discovered the dsh-standard way.
- 🔒 **Skill Security Auditor included**: scan skills for command injection /
  data exfiltration / prompt injection before installing.

### What you get

Skills land in DSH's global skill layer and are callable from any DSH surface
(web / TUI / headless):

```
Using the senior-architect skill, review our microservices architecture
and identify the top 3 scalability risks.
```

### Install

Not published to npm yet — install from GitHub (git installs may hit pnpm's
build-script allowlist; if refused, `dsh` prints the exact `allowBuilds` key to
add under the profile's `pnpm-workspace.yaml`, then re-run the same command.
This package has no build step, so most environments won't need it):

```bash
dsh plugin --profile <name> add github:GongYuanCaiJi/dsh-claude-skills
```

Local path (run `npm install` first):

```bash
git clone https://github.com/GongYuanCaiJi/dsh-claude-skills.git
cd dsh-claude-skills && npm install
dsh plugin --profile <name> add .
```

### Usage

Skills keep their per-domain layout (`engineering/skills/`, `marketing-skill/skills/`, …).
DSH discovery is one level deep (`<root>/<name>/SKILL.md`), so each domain
directory is a registered root. Call any skill by name after install.

### Known boundaries

- **Counts:** **362** is the upstream's claim (the canonical tree does hold 362
  SKILL.md files). This plugin registers **361** of them (88 roots, exhaustive
  coverage enforced by the test suite); 2 (`markdown-html/skills/design-system`,
  `md-slides`) have frontmatter DSH's YAML parser rejects (upstream data quirk,
  kept verbatim — DSH warns and skips them at discovery), so **359 are usable**.
- Cross-tool conversion trees shipped by upstream (`.codex/`, `.gemini/`,
  `.hermes/`, `.vibe/`) are kept verbatim but **not registered** — they are
  copies for other agents and would duplicate the catalog.
- Upstream's Claude Code-only mechanisms (`commands/` slash commands,
  `.claude/agents/` subagents, `.claude-plugin/` marketplace) are preserved
  as-is; DSH does not consume them. See delivery report #37.

### License

MIT. Skill content © 2025 [Alireza Rezvani](https://github.com/alirezarezvani/claude-skills)
(upstream) — **star the upstream too** ⭐; port layer © 2026 GongYuanCaiJi.
Attribution and upstream hashes: [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).
