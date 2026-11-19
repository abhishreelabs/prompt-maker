import type { PromptTone, TargetModel, UseCaseId, PromptTransformationResult } from '../types/index.ts';
import { MODEL_PRESETS } from '../data/models.ts';
import { analyzeBadPrompt } from './promptAnalyzer.ts';

interface EnhanceParams {
  rawPrompt: string;
  useCase: UseCaseId;
  targetModel: TargetModel;
  tone: PromptTone;
  framework?: string;
}

export function enhancePromptOffline({
  rawPrompt,
  useCase,
  targetModel,
  tone,
  framework = 'TypeScript'
}: EnhanceParams): PromptTransformationResult {
  const analysis = analyzeBadPrompt(rawPrompt, useCase);
  const trimmed = rawPrompt.trim();

  // Role Mapping based on useCase & tone
  const roles: Record<UseCaseId, string> = {
    'ui-testing': 'Principal QA Automation Architect specializing in flaky-free E2E web testing and Web Accessibility (WCAG 2.1 AA)',
    'unit-testing': 'Senior Software Engineer specializing in Test-Driven Development (TDD), mocking boundaries, and high code coverage',
    'bug-fixing': 'Staff Systems Debugger and Root Cause Analysis (RCA) specialist with deep experience in production triage',
    'code-refactoring': 'Staff Software Architect specializing in clean architecture, SOLID principles, and zero-downtime refactoring',
    'feature-implementation': 'Principal Fullstack Software Engineer focused on modular, scalable, and type-safe architecture',
    'api-design': 'API Platform Architect specializing in RESTful/GraphQL semantics, idempotent design, and resilient contract schemas',
    'code-review': 'Senior Principal Security & Code Review Auditor specializing in OWASP Top 10 prevention and architectural cleanliness',
    'db-optimization': 'Database Performance Tuning Expert & PostgreSQL DBA specializing in index design and query execution plans',
    'devops-docker': 'Senior Site Reliability & Cloud Infrastructure Engineer specializing in hardened containers and zero-trust CI/CD',
    'general-developer': 'Senior Software Architect and Systems Design Specialist'
  };

  const role = roles[useCase];

  // Derive specialized objective
  const objective = `Transform the following developer requirement into an exhaustive, production-grade implementation:\n"${trimmed}"\n\nEnsure complete type safety, defensive validation, testability, and adherence to modern standards using ${framework}.`;

  // Context & assumptions
  const context = `Target Framework: ${framework}\nDesign Pattern: Modern idiomatic patterns with zero deprecated APIs or anti-patterns.\nTarget Audience: Senior Engineering Team.\nClarity & Completeness: Self-contained, runnable, and defensively programmed.`;

  // Specific instructions based on use case
  let instructions: string[] = [];
  let edgeCases: string[] = [];
  let constraints: string[] = [];
  const improvements: string[] = [];

  switch (useCase) {
    case 'ui-testing':
      instructions = [
        `Structure tests using the standard Test Runner / Framework best practices (${framework}). Group tests logically with descriptive describe/it blocks.`,
        'Use resilient, user-facing accessible locators ONLY: prefer `getByRole`, `getByLabel`, `getByPlaceholder`, `getByText` over brittle CSS/XPath selectors.',
        'Implement network interception and route mocking for all backend API endpoints to keep the UI test deterministic and independent of backend latency.',
        'Ensure automatic web-first assertions (e.g. `expect(locator).toBeVisible()`) that naturally wait for DOM stability without arbitrary timeouts.',
        'Include setup and teardown hooks (beforeEach/afterEach) to clean cookies, local storage, and reset test state.'
      ];
      edgeCases = [
        'Negative path: Form submission with empty required fields; verify specific inline validation messages and focus state.',
        'Negative path: Submission with invalid formats (e.g. malformed email, passwords below complexity threshold).',
        'Backend error: Mock a 500 Internal Server Error / 401 Unauthorized from the server and assert graceful UI banner alert.',
        'Slow network / Latency: Mock high network delay (e.g. 2000ms) and verify disabled submit button and loading spinner state.',
        'Keyboard accessibility (a11y): Verify Tab navigation order, Enter key submission, and Escape key dismissal of dialogs.',
        'Responsive layout: Test behavior under mobile viewport (375x667) vs desktop (1280x720).'
      ];
      constraints = [
        'NEVER use hardcoded time waits (e.g. page.waitForTimeout(3000) or cy.wait(2000)); rely purely on state and event assertions.',
        'NEVER use fragile DOM paths like "div > div:nth-child(2) > button".',
        'DO NOT leave unhandled promise rejections or unclosed browser contexts.',
        'Provide all test fixtures, mock payloads, and helper functions inline so the test file is 100% runnable.'
      ];
      improvements.push('Injected resilient accessible locators (getByRole, getByLabel)');
      improvements.push('Enforced deterministic auto-wait assertions (zero sleep timeouts)');
      improvements.push('Added negative, network failure, and mobile viewport test matrix');
      improvements.push('Included accessibility & keyboard navigation verification');
      break;

    case 'unit-testing':
      instructions = [
        `Construct an isolated test suite in ${framework} targeting 100% branch and edge-case coverage.`,
        'Mock all external side effects, file system access, network I/O, and database layers using clean spies/mocks.',
        'Employ table-driven (parameterized) tests (`test.each` or `@pytest.mark.parametrize`) for diverse input combinations.',
        'Verify both synchronous return values and asynchronous Promise resolutions and rejections.'
      ];
      edgeCases = [
        'Inputs with null, undefined, NaN, empty strings, and empty arrays.',
        'Boundary numerical values (0, negative numbers, Number.MAX_SAFE_INTEGER).',
        'Third-party dependency failure / thrown Exceptions; verify proper error wrapping and bubble-up.',
        'Concurrent invocation / race condition handling.'
      ];
      constraints = [
        'No external network or database calls during unit test runs.',
        'Keep tests deterministic, fast, and idempotent.',
        'Avoid logic inside tests (no if/else branching inside test bodies).'
      ];
      improvements.push('Added table-driven test matrix for combinatorial coverage');
      improvements.push('Specified isolated mock boundaries for all side effects');
      improvements.push('Added boundary conditions (null, overflow, empty collections)');
      break;

    case 'bug-fixing':
      instructions = [
        'Analyze the root cause methodically: hypothesize why the failure occurs given the technical stack and runtime behavior.',
        'Provide a Minimal Reproducible Example (MRE) that demonstrates the defect in isolation.',
        'Explain the underlying mechanism causing the defect (e.g. memory leak, closure trap, race condition, stale closure, unhandled async event).',
        'Provide the corrected, production-ready code with explanatory inline comments highlighting the fix.',
        'Provide a regression test that fails before the fix and passes cleanly after.'
      ];
      edgeCases = [
        'High-concurrency or high-load conditions where the bug triggers intermittently.',
        'Browser/Node environment differences or unexpected version incompatibilities.',
        'Unexpected data payloads or null pointer dereferences that triggered the condition.'
      ];
      constraints = [
        'Do not apply duct-tape or quick-hack fixes (e.g., arbitrary timeouts, suppress warnings). Fix the underlying architecture.',
        'Preserve all existing public interfaces and backwards compatibility.'
      ];
      improvements.push('Enforced systematic Root Cause Analysis before jumping to code');
      improvements.push('Required a failing regression test to guarantee zero future regressions');
      improvements.push('Added concurrency and environment boundary checks');
      break;

    case 'code-refactoring':
      instructions = [
        `Refactor the specified code targeting modern ${framework} design standards, modularity, and readability.`,
        'Decompose monolithic blocks into small, single-responsibility functions or modules.',
        'Ensure strict type definitions without using `any` or loose type casting.',
        'Optimize computational complexity (targeting O(1) or O(n) where feasible).',
        'Present the refactoring with a clear Before vs. After comparison highlighting architectural improvements.'
      ];
      edgeCases = [
        'Preservation of all legacy edge-case behaviors and return values.',
        'Handling of falsy, nil, or undefined parameters without breaking changes.'
      ];
      constraints = [
        'Do NOT break existing function signatures or API contracts unless explicitly deprecating.',
        'Zero regression in performance or memory overhead.'
      ];
      improvements.push('Enforced Single Responsibility Principle (SOLID) modularization');
      improvements.push('Required strict type definitions (zero `any`)');
      improvements.push('Added Before/After architectural breakdown');
      break;

    case 'api-design':
      instructions = [
        'Design a clean, RESTful (or GraphQL) schema adhering to standard HTTP semantics and status codes.',
        'Define explicit request and response schemas with data validation rules (e.g. Zod / Pydantic).',
        'Implement idempotency mechanisms (e.g. Idempotency-Key headers) for mutation endpoints.',
        'Standardize error responses using RFC 7807 (Problem Details for HTTP APIs).'
      ];
      edgeCases = [
        'Rate limiting triggers (HTTP 429 Too Many Requests with Retry-After header).',
        'Replay attacks or duplicate concurrent webhook deliveries.',
        'Validation failure payloads listing specific field paths and rejection reasons.'
      ];
      constraints = [
        'Never leak internal stack traces or database errors in API responses.',
        'Enforce strict authentication and authorization checks on all endpoints.'
      ];
      improvements.push('Added RFC 7807 standardized error formatting');
      improvements.push('Included idempotency and replay-attack defenses');
      improvements.push('Defined strict schema validation contracts');
      break;

    default:
      instructions = [
        `Execute the implementation cleanly using modern ${framework} standards.`,
        'Organize the code into modular, maintainable, and well-typed structures.',
        'Include clear documentation, usage examples, and installation/run instructions.'
      ];
      edgeCases = [
        'Exceptional and malformed input states.',
        'Network drops, timeouts, or resource exhaustion.'
      ];
      constraints = [
        'Deliver complete, production-ready code with no placeholder comments like "// implement later".',
        'Adhere to security and performance best practices.'
      ];
      improvements.push('Converted vague request into structured technical specifications');
      improvements.push('Enforced production completeness (no "// todo" placeholders)');
      improvements.push('Added defensive input handling');
  }

  // Adjust for Tone
  if (tone === 'crisp') {
    constraints.push('Be concise: avoid conversational introductions or conclusions. Deliver the technical solution directly.');
    improvements.push('Tuned for crisp, zero-filler execution');
  } else if (tone === 'step-by-step') {
    instructions.unshift('Break down the solution into sequential phases: 1. Setup, 2. Implementation, 3. Verification.');
    improvements.push('Structured into guided step-by-step tutorial phases');
  } else if (tone === 'qa-adversarial') {
    edgeCases.push('Security: Attempt injection, buffer overflow, and parameter tampering inputs.');
    edgeCases.push('Concurrency: Rapid spam clicks, aborted requests, and out-of-order responses.');
    improvements.push('Injected adversarial QA edge-cases to stress-test system boundaries');
  }

  // Output format specification
  const outputFormat = `Provide the output in the following format:
1. **Architectural Overview & Key Decisions** (brief summary)
2. **Complete, Syntactically Valid Code Blocks** (fully typed, fully runnable, self-contained with all imports and mocks)
3. **Execution Instructions & Verification Commands** (e.g. CLI commands to run the test or execute the code)
4. **Edge Cases Covered Checklist** (brief verification list matching the above scenarios)`;

  // Wrap using Model Preset
  const modelPreset = MODEL_PRESETS[targetModel] || MODEL_PRESETS.gpt4o;
  const enhancedPrompt = modelPreset.formatWrapper({
    role,
    objective,
    context,
    instructions,
    edgeCases,
    constraints,
    outputFormat
  });

  return {
    originalPrompt: rawPrompt,
    enhancedPrompt,
    useCase,
    targetModel,
    tone,
    framework,
    clarityScoreBefore: analysis.clarityScore,
    clarityScoreAfter: 96,
    improvements,
    detectedVariables: analysis.detectedVariables,
    timestamp: Date.now(),
    engineUsed: 'offline-smart-template'
  };
}
