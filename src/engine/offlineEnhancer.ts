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
    'devops-infra': 'Principal Cloud Infrastructure Engineer specializing in Cloudflare DNS, Render Web Services, and Better Stack Uptime',
    'security-privacy': 'Chief Security Architect specializing in OWASP Web Vulnerabilities, Zero-Trace Ephemeral Systems, and E2EE Cryptography',
    'secrets-observability': 'DevOps & Reliability Architect specializing in Infisical Secret Synchronization and Sentry Production Observability',
    'healthcare-doctor': 'Principal HealthTech Architect specializing in HIPAA-Compliant Symptom Triage, Doctor Scheduling, and Multi-Tenant Systems',
    'image-generation': 'Staff AI Creative Director & Prompt Engineer specializing in Photorealistic Infographics and Bilingual Composition',
    'concurrency-scaling': 'Distributed Systems Architect specializing in High-Concurrency WebSockets, Socket.io Redis Adapters, and Cluster Profiling',
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

    case 'devops-infra':
      instructions = [
        `Diagnose and configure Cloudflare DNS, Render deployment, and Better Stack uptime monitoring for ${framework}.`,
        'Verify Cloudflare Proxied (Orange Cloud) vs DNS-Only (Grey Cloud) configuration for uptime probe compatibility.',
        'Implement automated heartbeat ping / cron worker to prevent free-tier inactivity sleep (e.g. Upstash Redis, Render).',
        'Provide exact CLI verification commands (dig +trace, curl -Iv, nslookup) to validate DNS propagation and SSL certificate status.'
      ];
      edgeCases = [
        'DNS lookup failure (NXDOMAIN / SERVFAIL) due to CNAME flattening or stale TTL cache.',
        'Better Stack uptime alerts triggering false alarms due to Cloudflare DDoS bot challenge.',
        'Render cold-start latency (50-60s) triggering premature gateway timeout (504).'
      ];
      constraints = [
        'Zero-cost tier priority: solution must run within free-tier quotas without requiring paid enterprise infrastructure.',
        'Never expose origin server IP directly; ensure Cloudflare DDoS protection remains intact.'
      ];
      improvements.push('Diagnosed Cloudflare proxy vs DNS-only probe conflict');
      improvements.push('Injected zero-cost automated keep-alive cron architecture');
      improvements.push('Added exact terminal DNS diagnostic commands');
      break;

    case 'security-privacy':
      instructions = [
        'Perform an exhaustive security and privacy audit based on OWASP Top 10 and real-time WebSocket attack vectors.',
        'Enforce true Zero-Trace RAM-only storage: verify zero persistence to disk, databases, or unencrypted log aggregators.',
        'Implement cryptographic timing-safe comparisons (`crypto.timingSafeEqual`) for room passcodes and access tokens.',
        'Architect auto-burn photo & text countdown synchronization between client canvas and server-authoritative purge signal.'
      ];
      edgeCases = [
        'Host doorbell knock bypass: unauthorized socket connection attempting direct room room join without host approval.',
        'XSS payload injection inside markdown/raw message content.',
        'Memory leaks in room Map holding onto client ArrayBuffers after room destruction.'
      ];
      constraints = [
        'No persistence: NEVER write messages, photos, or IP addresses to permanent storage or un-redacted logs.',
        'Cache-Control headers must strictly specify "no-store, no-cache, must-revalidate, private".'
      ];
      improvements.push('Enforced true Zero-Trace in-memory ephemeral lifecycle');
      improvements.push('Injected timing-safe cryptographic comparisons and XSS sanitation');
      improvements.push('Specified server-authoritative auto-burn countdown protocol');
      break;

    case 'secrets-observability':
      instructions = [
        `Formulate automated secret injection and production observability using ${framework}.`,
        'Provide programmatic Infisical CLI commands (`infisical run`, `infisical export`) for seamless environment syncing (dev, prod, local).',
        'Configure Sentry Next.js / Node SDK with source-map uploads and automated PII scrubbing (passwords, tokens, cookies, chat payloads).',
        'Ensure zero secrets are committed to git repositories or baked into client-side bundles.'
      ];
      edgeCases = [
        'Infisical secret token expiration or missing environment tag causing silent runtime failure.',
        'Sentry error flood during cascading network failure; configure client-side deduplication and sampleRate.',
        'Next.js public runtime config accidentally exposing NEXT_PUBLIC_ variables containing private credentials.'
      ];
      constraints = [
        'NEVER advise manual copy-pasting of .env files; enforce automated Infisical secret management.',
        'PII scrubbers must redact user emails, room passcodes, and authorization headers before transmitting to Sentry.'
      ];
      improvements.push('Configured programmatic Infisical secret sync workflow');
      improvements.push('Added Sentry Next.js SDK with automated PII redaction rules');
      improvements.push('Prevented client-side credential exposure leaks');
      break;

    case 'healthcare-doctor':
      instructions = [
        `Architect and test a HIPAA-compliant virtual doctor triage and appointment booking system using ${framework}.`,
        'Implement a finite state machine for clinical symptom intake with clear medical disclaimers and emergency 911/112 escalations.',
        'Ensure calendar slot reservation is atomic and idempotent to eliminate double-booking race conditions.',
        'Enforce strict multi-tenant white-label isolation: brand themes, clinic domain routing, and isolated patient data.'
      ];
      edgeCases = [
        'Patient reports high-acuity red flag symptoms (chest pain, shortness of breath); trigger immediate emergency prompt redirect.',
        'Concurrent users attempting to book the exact same doctor consultation slot at the same second.',
        'White-label tenant branding leakage (e.g. wrong hospital name or logo appearing on patient receipt).'
      ];
      constraints = [
        'Medical liability safety: Must always output explicit medical advice disclaimers and recommend consulting a licensed physician.',
        'Patient Protected Health Information (PHI) must be encrypted both in transit (TLS 1.3) and at rest.'
      ];
      improvements.push('Injected clinical symptom triage state machine with safety disclaimers');
      improvements.push('Added atomic calendar slot locking to eliminate double bookings');
      improvements.push('Enforced strict multi-tenant white-label brand isolation');
      break;

    case 'image-generation':
      instructions = [
        `Construct an authentic, hyper-detailed visual infographic prompt specification for ${framework}.`,
        'Structure prompt into bilingual specifications: authentic local language step-by-step guidance + high-definition English imagery description.',
        'Provide precise agricultural / technical specifications: exact potting soil ratios (vermicompost, cocopeat, sand), grow bag dimensions, and harvest timelines.',
        'Enforce visual quality constraints: authentic rooftop terrace setting, morning natural lighting, crisp typography, and 4:5 social media aspect ratio.'
      ];
      edgeCases = [
        'AI rendering garbled illegible text: specify negative prompt weights against pseudo-characters and distorted lettering.',
        'Unrealistic or generic stock photo look: inject authentic cultural and local contextual anchors.'
      ];
      constraints = [
        'Negative prompts: avoid cartoonish, oversaturated, low-res, deformed hands, or blurry foliage.',
        'Deliverable must include ready-to-run prompt block + copy-paste parameters for target image model.'
      ];
      improvements.push('Structured bilingual infographic specifications with technical soil ratios');
      improvements.push('Added authentic contextual cultural anchors (Indian rooftop terrace garden)');
      improvements.push('Injected negative prompt weights to prevent garbled text and distorted foliage');
      break;

    case 'concurrency-scaling':
      instructions = [
        `Architect and benchmark high-concurrency real-time WebSocket scaling for ${framework}.`,
        'Implement Socket.io Redis Streams / Redis Adapter architecture for horizontal multi-instance scaling.',
        'Configure sticky session routing cookies at the reverse proxy layer (Cloudflare / Nginx / Render).',
        'Profile memory footprint per connected socket (~15KB) and implement aggressive cleanup for disconnected zombie clients.'
      ];
      edgeCases = [
        'Network flap causing rapid reconnect storm; implement exponential backoff with jitter on client.',
        'Redis pub/sub bottleneck under high broadcast fan-out; batch room notifications.'
      ];
      constraints = [
        'Never rely on single-node memory when scaling past 1,000 concurrent sockets.',
        'Ensure heartbeats (pingInterval/pingTimeout) prune inactive sockets to avoid memory bloat.'
      ];
      improvements.push('Designed Socket.io Redis adapter horizontal cluster architecture');
      improvements.push('Configured sticky-session reverse proxy requirements');
      improvements.push('Implemented zombie connection eviction and memory bounds');
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
