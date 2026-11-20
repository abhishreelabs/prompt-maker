# Prompt Maker 🚀

> **Turn rough developer drafts into elite, production-grade AI prompts.**  
> Available as an **Interactive Web Studio** ([prompt-maker.abhishreelabs.in](https://prompt-maker.abhishreelabs.in)), **Standalone Terminal CLI**, **MCP Server**, and **Antigravity AI Agent Skill**.

Prompt Maker is built for software engineers who know what they want to build or test, but don't want to spend time manually drafting multi-page meta-prompts with roles, boundary conditions, edge cases, deterministic locators, zero-stub guarantees, and output schemas.

[![Live on Cloudflare](https://img.shields.io/badge/Live%20Studio-prompt--maker.abhishreelabs.in-f38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://prompt-maker.abhishreelabs.in)
[![npm version](https://img.shields.io/npm/v/@abhishreelabs/prompt-maker?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@abhishreelabs/prompt-maker)

---

## The Problem
When developers ask AI:
> *"test the login form with email and password"*

AI models often generate:
- ❌ **Brittle selectors** (`div:nth-child(2) > input`) that break on any DOM update
- ❌ **Arbitrary `sleep(3000)` timeouts** causing flaky CI/CD runs
- ❌ **Missing negative paths** (blank inputs, malformed regex, server 500s)
- ❌ **Missing accessibility assertions** (ARIA attributes, keyboard navigation)
- ❌ **Incomplete code** with placeholder comments like `// implement your logic here`

## The Solution
Prompt Maker transforms your draft into an **exhaustive, flake-free specification** (raising clarity from ~25/100 to **98/100**):
- ✅ **Domain Role & Persona Injection** (e.g. Principal QA Automation Architect)
- ✅ **Resilient Accessible Locators** (`getByRole`, `getByLabel` over brittle CSS/XPath)
- ✅ **Flake-free Auto-wait Assertions** (Zero arbitrary sleeps)
- ✅ **Dynamic Keyword Safeguards** (Timing-safe crypto for auth, idempotency keys for Stripe, focus traps for modals, multi-stage non-root for Docker)
- ✅ **Strict Zero-Stub Guarantee** (Banning `// TODO` or `...rest of code`)
- ✅ **Anti-Hallucination Guardrail** (Verified libraries and APIs only)
- ✅ **Executable Terminal Verification Protocol** (Ready-to-run CLI commands like `npx playwright test --ui`)

---

## 🛠️ Four Ways to Use Prompt Maker

### 1. 🖥️ Standalone Terminal CLI (`prompt-maker`)
Linked globally on your system. Run from anywhere in your terminal:

```bash
# Enhance a prompt and print formatted output directly:
prompt-maker "test login form with email & password" --use-case ui-testing

# Pipe directly into your clipboard:
prompt-maker "create stripe checkout webhook endpoint" --use-case api-design --quiet | pbcopy

# Machine-readable JSON output (ideal for scripts and agents):
prompt-maker "dockerize nextjs app with non-root user" --use-case devops-docker --json

# Audit a prompt and diagnose missing safeguards & clarity defects:
prompt-maker analyze "my sql query is slow" --use-case db-optimization

# Explore learned real-world workflows from active workspace repositories:
prompt-maker learned --project Ephemeral

# Mine all real developer prompts from local agent sessions across 26 domains:
prompt-maker mine

# Start the MCP stdio server:
prompt-maker mcp
```

#### CLI Options:
| Option | Description |
| :--- | :--- |
| `-u, --use-case <id>` | 26 domains: `ui-testing`, `unit-testing`, `bug-fixing`, `code-refactoring`, `feature-implementation`, `api-design`, `code-review`, `db-optimization`, `devops-docker`, `devops-infra`, `security-privacy`, `secrets-observability`, `healthcare-doctor`, `image-generation`, `concurrency-scaling`, `webrtc-video`, `pdf-document-ai`, `social-automation`, `iot-terrace-farming`, `multi-tenant-branding`, `state-cache-invalidation`, `monorepo-branch-split`, `mobile-touch-qa`, `local-cloud-emulation`, `patent-compliance`, `general-developer` |
| `-f, --framework <name>` | Target framework (e.g. `Playwright (TypeScript)`, `Next.js 16`, `FastAPI`, `Cloudflare DNS`) |
| `-m, --model <model>` | Target model wrapper: `claude` (Anthropic XML tags), `gpt4o` (Markdown), `gemini` (Grounding), `cursor` (Concise rules) |
| `-t, --tone <tone>` | `production`, `crisp`, `step-by-step`, `qa-adversarial` |
| `-j, --json` | Output machine-readable JSON object |
| `-q, --quiet` | Output only the enhanced prompt without metadata banners |

---

### 2. ⚡ Antigravity AI Agent Skill (`SKILL.md`)
Installed globally in `~/.gemini/antigravity/skills/prompt-maker/SKILL.md`.

Antigravity coding agents automatically activate this skill when asked to write tests, build APIs, fix bugs, or optimize performance. The agent calls `prompt-maker` internally to compile a rock-solid specification before writing code, guaranteeing zero hallucinated packages and zero placeholder stubs.

---

### 3. 🤖 Model Context Protocol (MCP) Server
Any AI coding assistant supporting MCP can call Prompt Maker as a native tool!

#### Tools Exposed:
1. `enhance_developer_prompt(raw_prompt, use_case, framework, target_model, tone)`: Returns the hardened, edge-case-proof prompt.
2. `analyze_developer_prompt(raw_prompt, use_case)`: Audits clarity score and flags missing architectural elements.
3. `get_learned_workflows(project_filter, category)`: Returns real-world problem statements and safeguards learned from workspace repositories.

#### A. Cursor IDE (`.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "prompt-maker": {
      "command": "npx",
      "args": ["-y", "@abhishreelabs/prompt-maker", "mcp"]
    }
  }
}
```

#### B. Claude Desktop (`claude_desktop_config.json`)
Location: `~/Library/Application Support/Claude/claude_desktop_config.json`
```json
{
  "mcpServers": {
    "prompt-maker": {
      "command": "npx",
      "args": ["-y", "@abhishreelabs/prompt-maker", "mcp"]
    }
  }
}
```

#### C. Windsurf IDE (`mcp_config.json`)
Location: `~/.codeium/windsurf/mcp_config.json`
```json
{
  "mcpServers": {
    "prompt-maker": {
      "command": "npx",
      "args": ["-y", "@abhishreelabs/prompt-maker", "mcp"]
    }
  }
}
```
    "prompt-maker": {
      "command": "prompt-maker-mcp"
    }
  }
}
```

---

### 4. 🌐 Interactive Web Studio
**Live URL**: [https://prompt-maker.abhishreelabs.in](https://prompt-maker.abhishreelabs.in) *(Mirror: [prompt-maker-br3.pages.dev](https://prompt-maker-br3.pages.dev))*  
Or run locally on `http://localhost:5173`:
- **Zero Backend Required**: Runs 100% client-side with lightning-fast reactive compilation.
- **Split-Screen Studio**: Live before-and-after view of your prompt.
- **Dynamic Variable Detection**: Automatically highlights replaceable tokens (`[email]`, `[password]`).
- **Audit Card**: Clarity score progression (`32/100` ➔ `98/100`) and missing defect badges.
- **Behavioral Agent Execution Forecast**: Side-by-side simulation comparing what an unhardened agent fails at vs how the hardened prompt directs flawless execution.
- **Visual Compilation Pipeline**: 4-stage pipeline (Analyzer ➔ Intent Classifier ➔ Dynamic Safeguard Injection ➔ Model Formatter).
- **Light & Dark Mode**: Handcrafted themes with Google **Outfit** (headings) and **Inter** (body) typography.
- **Learned Workflows Drawer**: 14 real-world workflows extracted from active production repositories.

---

## 🧠 Dynamic Keyword Safeguards

Prompt Maker automatically scans raw prompts and injects targeted production rules:

| Keyword Trigger | Injected Safeguards |
| :--- | :--- |
| `login`, `auth`, `password`, `jwt` | Timing-safe comparisons (`crypto.timingSafeEqual`), 5-attempt rate-limiting lockout (HTTP 429), accessible password visibility toggle, session revocation on logout. |
| `stripe`, `payment`, `billing` | `Idempotency-Key` headers on mutations, integer-cents currency arithmetic, raw unparsed webhook signature verification (`stripe-signature`). |
| `table`, `pagination`, `filter` | Debounced search input (300ms) with `AbortController` cancellation, deterministic secondary sort key, window virtualization for >500 rows. |
| `modal`, `dialog`, `drawer` | WCAG 2.1 AA keyboard focus trap, background body scroll lock (`overflow: hidden`), Escape key dismissal, focus restoration to trigger element. |
| `docker`, `dockerfile`, `container` | Multi-stage Docker build, unprivileged non-root user execution (`USER node`), container `HEALTHCHECK`, PID 1 signal forwarding. |
| `sql`, `postgres`, `query` | `EXPLAIN (ANALYZE, BUFFERS)` execution plan verification, composite index alignment, N+1 query elimination, connection pool exhaustion handling. |
| `api`, `endpoint`, `rest` | Strict Zod/Pydantic validation schemas, HTTP status code semantics, RFC 7807 problem details, optimistic locking (`ETag`). |

---

## 🚀 Development & Build

```bash
# Install dependencies
npm install

# Start Vite local development server
npm run dev

# Run unit & MCP test suite
npm test

# Build production web bundle + CLI + MCP binaries
npm run build:all

# Link CLI globally to PATH
npm link
```
