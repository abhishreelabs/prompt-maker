# Prompt Maker 🚀

> **Turn rough developer drafts into elite, production-grade AI prompts.**

Prompt Maker is built for software engineers who know what they want to build or test, but don't want to spend time manually drafting multi-page meta-prompts with roles, boundary conditions, edge cases, deterministic locators, and output schemas.

---

## The Problem
When developers ask AI:
> *"test the login form with email and password"*

AI models often generate:
- ❌ Brittle selectors (`div:nth-child(2) > input`) that break on any DOM update
- ❌ Arbitrary `sleep(3000)` timeouts causing flaky CI/CD runs
- ❌ Missing negative paths (blank inputs, malformed regex, server 500s)
- ❌ Missing accessibility assertions (ARIA attributes, keyboard navigation)
- ❌ Incomplete code with comments like `// implement your logic here`

## The Solution
Prompt Maker transforms your draft into an **ad-ready, flake-free prompt** that forces AI models to write bulletproof code:
- ✅ **Domain Role & Persona Injection** (e.g. Principal QA Automation Architect)
- ✅ **Resilient Locator Strategies** (Accessible `getByRole`, `getByLabel` over CSS)
- ✅ **Flake-free Auto-wait Assertions** (Zero arbitrary sleeps)
- ✅ **Negative & Edge-Case Matrix** (Network stubs, 500 errors, latency, mobile viewports)
- ✅ **Strict Deliverables & Schema** (Self-contained, runnable TypeScript code)

---

## 🛠️ Features

- ⚡ **Split-Screen Studio**: Live before-and-after view of your prompt.
- 🧠 **Dual-Engine Architecture**:
  - **Offline Smart Engine (Zero Cost)**: Instant rule-based prompt enhancement with built-in engineering frameworks. Requires zero API keys and zero internet access.
  - **AI-Powered Engine (Gemini 2.5 & OpenAI)**: Optional meta-prompt synthesis using Google Gemini 2.5 Flash or OpenAI.
- 🎯 **10+ Developer Engineering Presets**:
  - UI & E2E Testing (Playwright, Cypress, Selenium)
  - Unit & Integration Testing (Jest, Vitest, PyTest)
  - Bug Reproduction & Root Cause Analysis
  - Refactoring & Optimization (SOLID, clean architecture)
  - Feature Implementation Specifications
  - REST & GraphQL API Design (Zod, RFC 7807)
  - Code Review & Security Audit (OWASP Top 10)
  - Database & SQL Query Optimization
  - DevOps, Docker & CI/CD Pipelines
  - General Developer Engineering
- 🤖 **Target Model Presets**:
  - **Claude 3.7 / 3.5 Sonnet**: Structured with Anthropic-recommended XML tags (`<system>`, `<objective>`, `<instructions>`, `<edge_cases>`).
  - **GPT-4o / o3-mini**: Clean markdown hierarchy with bold directives.
  - **Google Gemini 2.5 Pro / Flash**: Grounding directives and system instructions.
  - **Cursor / Copilot / Windsurf**: Crisp `.cursorrules` style with zero conversational filler.
- 🔍 **Prompt Engineering Audit Card**: Visual breakdown of vulnerabilities detected in your draft and the architectural safeguards injected.
- 📋 **1-Click Copy & Export**: Copy to clipboard with celebratory feedback, export as `.cursorrules`, or download as `.md`.
- 💾 **Local History & Privacy**: Automatically archives previous prompt transformations in your browser's `localStorage`. API keys never leave your browser.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Quick Start
```bash
# Navigate to the repository
cd /Users/abhisheksahu/repos/prompt-maker

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Scripts
- `npm run dev` &mdash; Starts Vite local development server
- `npm run build` &mdash; Builds production bundle
- `npm run preview` &mdash; Previews production build locally
- `npm test` &mdash; Runs engine unit tests via Node test runner
