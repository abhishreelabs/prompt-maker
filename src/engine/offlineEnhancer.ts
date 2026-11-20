import type { PromptTone, TargetModel, UseCaseId, PromptTransformationResult } from '../types/index.ts';
import { MODEL_PRESETS } from '../data/models.ts';
import { analyzeBadPrompt } from './promptAnalyzer.ts';
import { generateExecutionForecast } from './forecastGenerator.ts';
import { scrubSecrets } from './secretScrubber.ts';

interface EnhanceParams {
  rawPrompt: string;
  useCase: UseCaseId;
  targetModel: TargetModel;
  tone: PromptTone;
  framework?: string;
  projectContext?: string;
}

interface DynamicSafeguard {
  matcher: RegExp;
  categoryName: string;
  instructions: string[];
  edgeCases: string[];
  constraints?: string[];
  improvementText: string;
}

function getVerificationCommands(framework: string, useCase: UseCaseId): string[] {
  const fw = framework.toLowerCase();
  if (useCase === 'ui-testing' || fw.includes('playwright')) {
    return [
      '# 1. Run Playwright UI inspector with time-travel debugger:',
      'npx playwright test --ui',
      '# 2. Run headed test against specific file:',
      'npx playwright test tests/e2e/login.spec.ts --headed --project=chromium',
      '# 3. Run accessibility audit assertions (axe-core):',
      'npx playwright test tests/e2e/a11y.spec.ts'
    ];
  }
  if (fw.includes('cypress')) {
    return [
      '# 1. Run Cypress tests headless in Chrome:',
      'npx cypress run --spec "cypress/e2e/**/*.cy.ts" --browser chrome',
      '# 2. Open Cypress interactive runner:',
      'npx cypress open'
    ];
  }
  if (useCase === 'unit-testing' || fw.includes('vitest') || fw.includes('jest')) {
    return [
      '# 1. Run unit test suite with coverage report:',
      'npm test -- --coverage --runInBand',
      '# 2. Run tests in watch mode for fast TDD iteration:',
      'npx vitest run --reporter=verbose'
    ];
  }
  if (fw.includes('python') || fw.includes('pytest') || fw.includes('fastapi') || fw.includes('django')) {
    return [
      '# 1. Run pytest with code coverage & verbose failure trace:',
      'pytest -v --cov=src --cov-report=term-missing',
      '# 2. Run type checking with mypy:',
      'mypy src/ --strict'
    ];
  }
  if (useCase === 'devops-docker' || fw.includes('docker')) {
    return [
      '# 1. Build hardened multi-stage Docker image:',
      'docker build --no-cache -t app:latest .',
      '# 2. Inspect image layer sizes & security vulnerabilities:',
      'docker history app:latest',
      '# 3. Run container locally with healthcheck polling:',
      'docker run --rm -d -p 3000:3000 --name test-app app:latest && docker inspect --format="{{json .State.Health}}" test-app'
    ];
  }
  if (useCase === 'devops-infra' || fw.includes('cloudflare') || fw.includes('dns')) {
    return [
      '# 1. Trace authoritative DNS resolution path:',
      'dig +trace api.yourdomain.com',
      '# 2. Check HTTP status, SSL certificate, and response headers:',
      'curl -Iv https://api.yourdomain.com/health',
      '# 3. Verify DNS CNAME record propagation globally:',
      'nslookup -type=cname api.yourdomain.com 1.1.1.1'
    ];
  }
  if (useCase === 'db-optimization' || fw.includes('postgres') || fw.includes('sql')) {
    return [
      '# 1. Run EXPLAIN ANALYZE on query with buffer cache stats:',
      'EXPLAIN (ANALYZE, BUFFERS, VERBOSE, SETTINGS) SELECT ...',
      '# 2. Check index hit ratios and sequential scan counts:',
      'SELECT relname, seq_scan, idx_scan FROM pg_stat_user_tables;'
    ];
  }
  if (useCase === 'webrtc-video' || fw.includes('webrtc')) {
    return [
      '# 1. Test WebRTC ICE candidate gathering and STUN/TURN latency:',
      'npx playwright test tests/webrtc/ice-connection.spec.ts',
      '# 2. Check local fake media stream permissions in headless browser:',
      'npx playwright test --use-fake-ui-for-media-stream --use-fake-device-for-media-stream'
    ];
  }
  if (useCase === 'pdf-document-ai' || fw.includes('pdf') || fw.includes('ocr')) {
    return [
      '# 1. Run PDF extraction and OCR pipeline benchmark:',
      'pytest tests/test_pdf_extractor.py -v',
      '# 2. Validate JSON schema extraction conformance against rubric:',
      'python -m src.evaluator --input sample_exam.pdf --schema rubric.json'
    ];
  }
  if (useCase === 'social-automation') {
    return [
      '# 1. Run OAuth 2.0 PKCE token refresh mock test:',
      'npm test tests/oauth-refresh.test.ts',
      '# 2. Test rate-limit backoff retry queue under simulated 429 throttling:',
      'npm test tests/rate-limiter.test.ts'
    ];
  }
  if (useCase === 'iot-terrace-farming' || fw.includes('mqtt')) {
    return [
      '# 1. Test weather forecast API irrigation suppression rule:',
      'npm test tests/irrigation-rules.test.ts',
      '# 2. Verify MQTT QoS 1 message persistence during connection flap:',
      'npm test tests/mqtt-telemetry.test.ts'
    ];
  }
  if (useCase === 'multi-tenant-branding' || fw.includes('rls')) {
    return [
      '# 1. Test edge middleware tenant hostname routing:',
      'npm test tests/tenant-middleware.test.ts',
      '# 2. Verify PostgreSQL Row Level Security (RLS) tenant isolation:',
      'npx prisma test --preview-feature'
    ];
  }
  if (useCase === 'state-cache-invalidation' || fw.includes('react query') || fw.includes('tanstack')) {
    return [
      '# 1. Run React Query mutation invalidation integration test:',
      'npm test tests/cache-invalidation.test.tsx',
      '# 2. Verify optimistic rollback snapshot on network drop:',
      'npx vitest run tests/optimistic-updates.test.tsx'
    ];
  }
  if (useCase === 'monorepo-branch-split' || fw.includes('turbo')) {
    return [
      '# 1. Run monorepo boundary linter (no internal imports in landing):',
      'npx turbo lint',
      '# 2. Verify landing page client bundle size is under 150KB:',
      'npx @next/bundle-analyzer'
    ];
  }
  if (useCase === 'mobile-touch-qa' || fw.includes('mobile')) {
    return [
      '# 1. Run mobile touch target audit (minimum 44x44px):',
      'npx playwright test tests/mobile-a11y.spec.ts --project="Mobile Chrome"',
      '# 2. Run soft keyboard viewport squish test (iPhone 14):',
      'npx playwright test tests/mobile-keyboard.spec.ts --project="Mobile Safari"'
    ];
  }
  if (useCase === 'local-cloud-emulation' || fw.includes('floci') || fw.includes('localstack')) {
    return [
      '# 1. Verify Floci / LocalStack container services are healthy:',
      'docker compose ps && awslocal s3 ls',
      '# 2. Test S3 presigned URL generation and upload locally:',
      'npm test tests/local-s3-upload.test.ts'
    ];
  }
  if (useCase === 'patent-compliance') {
    return [
      '# 1. Run license compliance audit for copyleft GPL/AGPL packages:',
      'npx license-checker --onlyAllow "MIT;Apache-2.0;BSD-3-Clause;ISC"',
      '# 2. Verify patent claim traceability documentation coverage:',
      'npm run audit:ip-compliance'
    ];
  }
  // Default TypeScript / JavaScript commands
  return [
    '# 1. Run TypeScript type check in strict mode:',
    'npx tsc --noEmit',
    '# 2. Run linter and formatting check:',
    'npm run lint',
    '# 3. Execute test suite:',
    'npm test'
  ];
}

const DYNAMIC_SAFEGUARDS: DynamicSafeguard[] = [
  {
    matcher: /\b(auth|login|signin|signup|register|jwt|token|password|session|oauth|credentials|cookie)\b/i,
    categoryName: 'Authentication & Session Security',
    instructions: [
      'Enforce cryptographic timing-safe comparisons (`crypto.timingSafeEqual`) for passwords/tokens to eliminate timing attack side-channels.',
      'Implement brute-force lockout / rate-limiting (e.g. 5 failed attempts per IP/account triggers HTTP 429 lockout with Retry-After header).',
      'Enforce accessible password inputs: include an accessible password visibility toggle button (`aria-label="Toggle password visibility"`).'
    ],
    edgeCases: [
      'Security: SQL/NoSQL injection payloads in credential inputs (e.g. `\' OR \'1\'=\'1\'`).',
      'Security: Complete session termination & cookie destruction (`Max-Age=0`, `HttpOnly`, `SameSite=Strict`, `Secure`) upon logout.',
      'Security: Tampered or expired JWT tokens returning standardized HTTP 401 Unauthorized.'
    ],
    improvementText: 'Injected timing-safe comparisons, rate-limiting lockout & credential sanitization'
  },
  {
    matcher: /\b(payment|stripe|billing|checkout|invoice|subscription|refund|credit card|charge)\b/i,
    categoryName: 'Payment & Financial Integrity',
    instructions: [
      'Mandate idempotency: inject `Idempotency-Key` headers on all charge and refund mutations to prevent duplicate debiting on network retries.',
      'Always represent currency amounts as integer minor units (e.g. cents in USD or paise in INR) to prevent IEEE 754 floating-point rounding errors.',
      'Validate raw webhook cryptographic signatures (`stripe-signature`) using raw unparsed request body before deserializing.'
    ],
    edgeCases: [
      'Financial: Card decline scenarios (insufficient funds, expired card, zip code mismatch, fraud score rejection).',
      'Financial: 3D Secure / SCA step-up customer authentication redirect and callback flow.',
      'Financial: Webhook delivery failure, delayed delivery, or out-of-order replay handling.'
    ],
    improvementText: 'Injected idempotency keys, integer-cents currency safety & raw webhook signature verification'
  },
  {
    matcher: /\b(table|pagination|paginate|grid|sort|filter|infinite scroll|search bar|list)\b/i,
    categoryName: 'Data Grid & Pagination Resilience',
    instructions: [
      'Debounce search/filter inputs (300ms) and use `AbortController` cancellation to discard superseded in-flight requests.',
      'Guarantee stable sorting: always specify a deterministic secondary sort key (e.g. primary key ID) to prevent jittery row reordering.',
      'Implement virtualized rendering (`react-window` or `@tanstack/react-virtual`) when rendering datasets with > 500 items to maintain 60 FPS.'
    ],
    edgeCases: [
      'UI Edge Case: Zero results / empty state with accessible illustration and clear reset-filters action.',
      'UI Edge Case: Boundary pagination navigation (page 0, negative pages, page > totalPages, rapid next/previous clicks).'
    ],
    improvementText: 'Injected debounced search cancellation, stable secondary sorting & empty-state recovery'
  },
  {
    matcher: /\b(modal|dialog|drawer|sheet|popup|popover|toast|alert dialog)\b/i,
    categoryName: 'Accessible Modal & Dialog Interactions',
    instructions: [
      'Enforce accessible dialog standards (WCAG 2.1 AA): trap keyboard focus within modal while open, lock background scroll (`overflow: hidden`), and restore focus to trigger button upon dismissal.',
      'Bind Escape key listener for immediate dismissal and backdrop click handler.'
    ],
    edgeCases: [
      'A11y Edge Case: Rapid Escape key or backdrop double-clicks during entrance/exit transitions.',
      'A11y Edge Case: Nested dialogs or stacked toast alerts correctly maintaining z-index hierarchy and focus order.'
    ],
    improvementText: 'Injected keyboard focus trapping, background scroll locking & Escape key dismissal'
  },
  {
    matcher: /\b(docker|dockerfile|container|k8s|kubernetes|helm|pod|image build)\b/i,
    categoryName: 'Hardened Containerization',
    instructions: [
      'Use multi-stage Docker builds to separate compilation tools from minimal production runtimes (e.g. `alpine` or `distroless`).',
      'Security hardening: run container under a dedicated unprivileged user (`USER node` or `USER 10001:10001`), never as root.',
      'Implement native container `HEALTHCHECK` and handle `SIGTERM` / `SIGINT` signals for graceful socket draining.'
    ],
    edgeCases: [
      'DevOps Edge Case: Zombie process accumulation or dropped connections due to missing init/PID 1 signal forwarding.',
      'DevOps Edge Case: `.dockerignore` leakage of local `.env` files, `.git` metadata, or `node_modules` into image layers.'
    ],
    improvementText: 'Enforced multi-stage rootless container hardening and healthcheck directives'
  },
  {
    matcher: /\b(database|postgres|postgresql|mysql|sql|prisma|query|index|explain|deadlock)\b/i,
    categoryName: 'Database Execution & Optimization',
    instructions: [
      'Profile queries using `EXPLAIN (ANALYZE, BUFFERS)` to verify index scans and eliminate sequential scans on large tables.',
      'Eliminate N+1 queries using batch loading, DataLoader, or explicit join strategies.',
      'Configure connection pool limits with exponential backoff retry for deadlock and transient connection dropouts.'
    ],
    edgeCases: [
      'Database Edge Case: Concurrent transaction deadlocks under serializable isolation level.',
      'Database Edge Case: Parameterized queries eliminating all SQL injection vectors.'
    ],
    improvementText: 'Injected EXPLAIN execution plan profiling, deadlock retries & N+1 elimination'
  },
  {
    matcher: /\b(api|endpoint|rest|route|crud|controller|http|graphql)\b/i,
    categoryName: 'API Contract & Resilient Semantics',
    instructions: [
      'Enforce strict bidirectional schema validation (Zod/Pydantic) for request parameters, query strings, headers, and response payloads.',
      'Adhere to HTTP status semantics: 201 Created with `Location` header, 204 No Content for DELETE, 400 with structured validation issues, 404 for missing resources.',
      'Format all error responses according to RFC 7807 (Problem Details for HTTP APIs).'
    ],
    edgeCases: [
      'API Edge Case: Malformed JSON or oversized payload (HTTP 413 Payload Too Large).',
      'API Edge Case: Concurrent modification race conditions (implement ETag / `If-Match` optimistic concurrency control).'
    ],
    improvementText: 'Injected RFC 7807 problem details, strict schema validation & optimistic concurrency control'
  }
];

export function enhancePromptOffline({
  rawPrompt,
  useCase,
  targetModel,
  tone,
  framework = 'TypeScript',
  projectContext
}: EnhanceParams): PromptTransformationResult {
  const scrubResult = scrubSecrets(rawPrompt);
  const sanitizedPrompt = scrubResult.cleanText;
  const analysis = analyzeBadPrompt(sanitizedPrompt, useCase);
  const trimmed = sanitizedPrompt.trim();

  // Role Mapping based on useCase
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
    'webrtc-video': 'Lead Real-Time Communications Architect specializing in WebRTC, MediaStream pipelines, and resilient STUN/TURN negotiation',
    'pdf-document-ai': 'Principal Document AI Architect specializing in high-throughput PDF extraction, OCR deskewing, and structured LLM evaluation',
    'social-automation': 'Senior Automation & API Integration Architect specializing in social platform APIs, OAuth2 lifecycle, and resilient queues',
    'iot-terrace-farming': 'Senior IoT & Agronomy Systems Architect specializing in sensor telemetry, smart irrigation rule engines, and terrace farming',
    'multi-tenant-branding': 'Principal Multi-Tenant Architect specializing in white-label SaaS, edge routing, and PostgreSQL Row-Level Security',
    'state-cache-invalidation': 'Staff Frontend Performance Architect specializing in TanStack Query, optimistic updates, and cache synchronization',
    'monorepo-branch-split': 'Principal Build Systems & Monorepo Architect specializing in Turborepo, workspace boundaries, and bundle optimization',
    'mobile-touch-qa': 'Lead Mobile Web QA Architect specializing in touch ergonomics, virtual keyboard mechanics, and responsive viewports',
    'local-cloud-emulation': 'Senior Cloud Platform & FinOps Engineer specializing in local cloud emulation, LocalStack/Floci, and zero-cost dev environments',
    'patent-compliance': 'Staff IP & Software Compliance Architect specializing in patent claim alignment, clean-room design, and open-source license audits',
    'general-developer': 'Senior Software Architect and Systems Design Specialist'
  };

  const role = roles[useCase] || roles['general-developer'];

  // Derive specialized objective
  const objective = `Transform the following developer requirement into an exhaustive, production-grade implementation:\n"${trimmed}"\n\nEnsure complete type safety, defensive validation, testability, and adherence to modern standards using ${framework}.`;

  // Context & assumptions
  let context = `Target Framework: ${framework}\nDesign Pattern: Modern idiomatic patterns with zero deprecated APIs or anti-patterns.\nTarget Audience: Senior Engineering Team.\nClarity & Completeness: Self-contained, runnable, and defensively programmed.`;
  if (projectContext) {
    context += `\nTarget Workspace / Project Context: ${projectContext}\nAdherence: Strictly conform to existing files, directory layout, dependencies, and code style in this project.`;
  }

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

    case 'feature-implementation':
      instructions = [
        `Architect the feature using modular, decoupled components in ${framework}.`,
        'Define strict TypeScript types/interfaces and validation schemas for all domain entities.',
        'Implement clear separation of concerns (Presentation Layer, Business Logic Layer, Data Access Layer).',
        'Implement all necessary UX states: loading (skeleton screens), error states, and empty states.',
        'Provide clean integration points and state management hooks.'
      ];
      edgeCases = [
        'Async race conditions: rapid user clicks or actions while previous operations are pending.',
        'Network interruption and offline state graceful degradation.',
        'User permission / authorization boundaries (role-based access control).'
      ];
      constraints = [
        'Never write business logic inside UI presentation components.',
        'Guarantee zero runtime errors on undefined or missing optional fields.'
      ];
      improvements.push('Injected modular domain architecture and state handling (loading/error/empty)');
      improvements.push('Enforced strict type boundaries and separation of concerns');
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

    case 'code-review':
      instructions = [
        'Conduct an adversarial security and architectural code review targeting OWASP Top 10 vulnerabilities.',
        'Identify race conditions, memory leaks, unhandled promise rejections, and algorithmic bottlenecks.',
        'Evaluate type safety, defensive validation, and error-handling resilience.',
        'Provide prioritized recommendations: Critical (immediate exploit), High (logic flaw), Medium (performance/maintainability), Low (style).',
        'Provide exact refactored code diffs showing the corrected implementation.'
      ];
      edgeCases = [
        'Malicious input payloads (XSS, SQLi, Prototype Pollution, Path Traversal).',
        'Concurrency deadlocks and stale closure captures in asynchronous loops.'
      ];
      constraints = [
        'Every flagged vulnerability must be accompanied by a concrete exploit scenario and the exact remediation diff.'
      ];
      improvements.push('Injected OWASP Top 10 adversarial vulnerability review framework');
      improvements.push('Categorized findings with severity levels and remediation diffs');
      break;

    case 'db-optimization':
      instructions = [
        `Analyze query performance, execution plans, and table statistics for ${framework}.`,
        'Profile index utilization: suggest composite, partial, or covering indexes aligned with WHERE and ORDER BY clauses.',
        'Eradicate N+1 queries using eager joins, batch queries, or DataLoader patterns.',
        'Provide safe, zero-downtime database migration scripts with rollback safeguards.'
      ];
      edgeCases = [
        'Large table locks during index creation (use CREATE INDEX CONCURRENTLY in PostgreSQL).',
        'Slow queries under concurrent peak write workloads.',
        'Connection pool starvation during long-running analytical queries.'
      ];
      constraints = [
        'Never suggest schema modifications that lock production tables without zero-downtime strategies.'
      ];
      improvements.push('Injected EXPLAIN execution plan analysis and concurrent indexing strategies');
      improvements.push('Eradicated N+1 query patterns and pool starvation risks');
      break;

    case 'devops-docker':
      instructions = [
        `Author a production-hardened, multi-stage Dockerfile optimized for ${framework}.`,
        'Separate build tools and development dependencies from minimal production base image.',
        'Execute as an unprivileged non-root user (e.g. USER node or USER 10001).',
        'Optimize layer caching by copying dependency manifests before source files.',
        'Include native HEALTHCHECK and configure signal handling for graceful shutdown.'
      ];
      edgeCases = [
        'SIGTERM signal ignored by node process running as PID 1 without an init system (use dumb-init or tini).',
        'Sensitive secrets leaked into image layers via build arguments.'
      ];
      constraints = [
        'Never run containers as root.',
        'Ensure .dockerignore excludes node_modules, .env files, and git history.'
      ];
      improvements.push('Enforced multi-stage rootless container hardening');
      improvements.push('Added graceful PID 1 signal termination and layer caching optimizations');
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
        'Host doorbell knock bypass: unauthorized socket connection attempting direct room join without host approval.',
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
        'White-label tenant branding leakage (e.g. wrong client logo or brand name appearing in multi-tenant portal).'
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

    case 'webrtc-video':
      instructions = [
        `Implement robust WebRTC peer-to-peer signaling and media negotiation using ${framework}.`,
        'Configure STUN and TURN server relays with credential expiration to guarantee connectivity behind symmetric NATs and corporate firewalls.',
        'Implement dynamic bitrate and resolution downscaling on packet loss or network degradation.',
        'Handle media track lifecycles gracefully (mute/unmute, camera switching, screen share track replacement via RTCRtpSender.replaceTrack).'
      ];
      edgeCases = [
        'ICE gathering state timeout or complete ICE failure; trigger automatic TURN relay retry.',
        'User revokes camera/microphone permissions mid-call; display non-blocking recovery guidance.',
        'Signaling WebSocket disconnects while media tracks are active (reconnect signaling socket without tearing down PeerConnection).'
      ];
      constraints = [
        'Always clean up active MediaStreamTracks (track.stop()) upon unmount to release camera hardware indicator.',
        'Handle getUserMedia rejection without uncaught promise exceptions.'
      ];
      improvements.push('Injected WebRTC STUN/TURN fallback and dynamic bitrate adaptation');
      improvements.push('Added camera/mic permission denial recovery handlers');
      improvements.push('Separated signaling socket lifecycle from media peer connection');
      break;

    case 'pdf-document-ai':
      instructions = [
        `Construct an accurate document extraction and parsing pipeline using ${framework}.`,
        'Apply OpenCV image preprocessing (deskewing, binarization, noise filtering) on low-DPI or photographed documents.',
        'Extract nested question hierarchies (sections, question stems, MCQ options, marks allocation) into strict schema models.',
        'Preserve embedded mathematical formulas and scientific symbols formatted as standard KaTeX / LaTeX.'
      ];
      edgeCases = [
        'Corrupted PDF stream or password-protected document; emit clean RFC 7807 error payload.',
        'Large 100+ page PDF processing: stream page-by-page to guarantee memory stays within bounds without process crash.',
        'Student handwriting partially overlapping printed borders or table cell dividers.'
      ];
      constraints = [
        'Never buffer multi-gigabyte document streams entirely in memory; use streaming or disk temporary storage.',
        'All output must conform strictly to typed schemas with validation error reporting.'
      ];
      improvements.push('Injected OpenCV document deskewing and contrast thresholding');
      improvements.push('Preserved LaTeX math equations and nested question schemas');
      improvements.push('Enforced page-by-page streaming memory bounds');
      break;

    case 'social-automation':
      instructions = [
        `Architect a resilient social publishing and scheduler pipeline using ${framework}.`,
        'Implement proactive OAuth 2.0 PKCE token refresh at least 5 minutes prior to access token expiration.',
        'Handle platform API rate limits gracefully using exponential backoff with full jitter honoring x-rate-limit-reset headers.',
        'Execute chunked asynchronous media uploads (INIT, APPEND, FINALIZE, STATUS) with progress polling.'
      ];
      edgeCases = [
        'Platform API returns HTTP 429 Too Many Requests; pause worker queue until reset timestamp.',
        'Network disconnect mid-chunk upload; resume from last verified chunk byte offset.',
        'Revoked client credentials or expired refresh token; emit alert notification without crashing worker.'
      ];
      constraints = [
        'Idempotent job execution: never publish duplicate posts if job retry occurs.',
        'Never log raw OAuth access tokens or client secrets in plain text.'
      ];
      improvements.push('Injected proactive OAuth 2.0 token rotation before expiration');
      improvements.push('Configured rate-limit exponential backoff with x-rate-limit-reset headers');
      improvements.push('Implemented chunked resumable media upload protocol');
      break;

    case 'iot-terrace-farming':
      instructions = [
        `Formulate an intelligent terrace farming and irrigation control model using ${framework}.`,
        'Define exact potting soil ratios (vermicompost, cocopeat, sand/perlite, neem khali) calibrated to specific crop types.',
        'Implement weather-predictive irrigation logic: query local precipitation forecast and suppress watering if rain probability > 60%.',
        'Process MQTT sensor telemetry (soil moisture %, ambient temperature, lux) with moving average smoothing to eliminate sensor noise.'
      ];
      edgeCases = [
        'Wi-Fi disconnection at terrace node: buffer readings locally with flash persistence and batch upload on reconnect.',
        'Sensor failure reporting 0% or 100% moisture continuously; trigger hardware fault alert.'
      ];
      constraints = [
        'Never run pump continuously on sensor communication timeout; enforce hardware watchdog cutoff (max 60 seconds).',
        'Provide multilingual localized agronomy guidance (Hindi and English).'
      ];
      improvements.push('Injected weather-aware smart irrigation suppression logic');
      improvements.push('Added exact potting soil ratios and crop disease remediation specs');
      improvements.push('Configured MQTT QoS 1 message persistence for intermittent sensor Wi-Fi');
      break;

    case 'multi-tenant-branding':
      instructions = [
        `Implement dynamic tenant resolution and white-label branding using ${framework}.`,
        'Resolve tenant identity at the edge/middleware from request hostname (subdomain or mapped custom domain) with zero database roundtrips.',
        'Inject dynamic CSS variable themes (primary colors, border radii, brand logos) without layout shifts or FOUC.',
        'Enforce strict multi-tenant data partitioning in PostgreSQL using Row Level Security (RLS) policies scoped to current tenant_id.'
      ];
      edgeCases = [
        'Request arrives from unmapped or expired custom domain; gracefully fallback to default platform tenant.',
        'Tenant theme specifies low-contrast colors; apply WCAG 2.1 AA luminance correction for accessibility.'
      ];
      constraints = [
        'Zero cross-tenant data leakage: all database queries must include tenant_id filter or enforce RLS.',
        'Cache-Control headers must not cache tenant-specific configuration across different hostnames.'
      ];
      improvements.push('Configured edge middleware hostname tenant resolution');
      improvements.push('Enforced PostgreSQL Row Level Security (RLS) tenant isolation');
      improvements.push('Injected dynamic CSS variable theming with zero layout shift');
      break;

    case 'state-cache-invalidation':
      instructions = [
        `Diagnose and resolve data staleness and cache synchronization issues using ${framework}.`,
        'Enforce targeted query cache invalidation (queryClient.invalidateQueries) immediately after successful mutations.',
        'Implement optimistic UI updates with pre-mutation snapshot capture and automatic rollback on network error.',
        'Configure stale-while-revalidate timings and window focus refetch boundaries to maintain real-time accuracy.'
      ];
      edgeCases = [
        'Write-after-read replication lag: read replica has not synchronized newly written record (implement read-your-writes header).',
        'Mutation fails while user has queued subsequent actions; cleanly revert state without corrupting adjacent store data.'
      ];
      constraints = [
        'Do not trigger infinite refetch loops: never invalidate queries inside render lifecycle or unmemoized useEffects.',
        'Always clean up mutation abort signals when unmounting components.'
      ];
      improvements.push('Configured targeted query cache invalidation on mutations');
      improvements.push('Added optimistic UI updates with error rollback snapshots');
      improvements.push('Mitigated write-after-read database replication lag');
      break;

    case 'monorepo-branch-split':
      instructions = [
        `Architect a clean monorepo workspace separation using ${framework}.`,
        'Isolate public customer applications (e.g. landing pages) from internal backoffice portals into separate workspace packages.',
        'Enforce strict package dependency rules: public apps must never import internal portal modules or private credentials.',
        'Establish a shared design system package (@workspace/ui) with peer-dependency deduplication and tree-shakeable exports.'
      ];
      edgeCases = [
        'Accidental export of private server-side secret or internal API route into public client bundle.',
        'Circular dependencies between shared workspace packages breaking build cache.'
      ];
      constraints = [
        'Landing page bundle must remain lightweight: enforce bundle size limits (<150KB first-load JS).',
        'Internal staff components must be strictly isolated to authenticated portal routes.'
      ];
      improvements.push('Partitioned public landing page from internal portal packages');
      improvements.push('Enforced strict dependency boundaries preventing credential leaks');
      improvements.push('Configured shared design system package with tree-shakeable exports');
      break;

    case 'mobile-touch-qa':
      instructions = [
        `Construct an exhaustive mobile web test suite using ${framework}.`,
        'Enforce WCAG 2.1 touch target requirements: all clickable buttons, links, and inputs must measure at least 44x44 CSS pixels.',
        'Simulate mobile soft keyboard appearance (window.visualViewport height reduction) and assert zero occlusion of form inputs and submit buttons.',
        'Verify safe area inset padding (env(safe-area-inset-top), env(safe-area-inset-bottom)) preventing layout overlaps with device notches and home indicators.'
      ];
      edgeCases = [
        'Virtual keyboard opens while user is focused on the bottom-most input in a scrollable modal.',
        'Rapid orientation changes (portrait <-> landscape) with active dropdown menus or modals.'
      ];
      constraints = [
        'Never use fixed pixel widths on container elements; enforce fluid responsive percentages and viewport units.',
        'Touch interactions must not trigger unwanted double-tap zoom delay.'
      ];
      improvements.push('Enforced WCAG 2.1 44x44px minimum touch target compliance');
      improvements.push('Added visual viewport virtual keyboard occlusion assertions');
      improvements.push('Injected safe-area-inset padding checks for mobile notch hardware');
      break;

    case 'local-cloud-emulation':
      instructions = [
        `Configure a zero-cost, fully offline local cloud environment using ${framework}.`,
        'Provide complete Docker Compose configuration for local AWS service emulation (S3, DynamoDB, SQS, IAM).',
        'Configure AWS SDK v3 client initialization with local endpoint overrides (http://localhost:4566) and test credentials.',
        'Automate local bucket creation and test asset seeding via reproducible shell startup scripts.'
      ];
      edgeCases = [
        'S3 presigned URLs generated with localhost:4566 breaking when accessed from inside another container network.',
        'Local persistence volume data corruption across docker restart cycles.'
      ];
      constraints = [
        'Zero cloud billing risk: verify zero network traffic leaves localhost to real AWS endpoints during local runs.',
        'Never commit local mock AWS credentials to public repositories.'
      ];
      improvements.push('Configured Floci / LocalStack zero-cost cloud emulation stack');
      improvements.push('Injected AWS SDK v3 client endpoint overrides and mock credentials');
      improvements.push('Added automated bucket provisioning and seeding shell script');
      break;

    case 'patent-compliance':
      instructions = [
        `Perform an intellectual property and commercial adoption compliance audit using ${framework}.`,
        'Construct a traceability matrix linking patent claim specifications and architectural drawings to concrete source code modules.',
        'Audit all project direct and transitive dependencies: identify and flag copyleft licenses (GPL, AGPL, SSPL) incompatible with proprietary commercial distribution.',
        'Document clean-room independent invention boundaries and verify absence of proprietary competitor code or copyrighted assets.'
      ];
      edgeCases = [
        'Dual-licensed dependencies (e.g. AGPL / Commercial) causing licensing confusion during commercial deployment.',
        'Patent claim requirements relying on deprecated or proprietary third-party libraries.'
      ];
      constraints = [
        'Commercial safety: every dependency must possess a permissive open-source license (MIT, Apache-2.0, BSD-3-Clause).',
        'Preserve full claim traceability documentation for patent examiners and IP auditors.'
      ];
      improvements.push('Constructed patent claim to code traceability matrix');
      improvements.push('Injected copyleft license audit filtering out GPL/AGPL dependencies');
      improvements.push('Documented clean-room independent invention boundaries');
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

  // Dynamic Keyword & Safeguard Injections
  for (const safeguard of DYNAMIC_SAFEGUARDS) {
    if (safeguard.matcher.test(trimmed)) {
      // Append instructions and edge cases if not already present
      for (const inst of safeguard.instructions) {
        if (!instructions.includes(inst)) {
          instructions.push(inst);
        }
      }
      for (const ec of safeguard.edgeCases) {
        if (!edgeCases.includes(ec)) {
          edgeCases.push(ec);
        }
      }
      if (safeguard.constraints) {
        for (const c of safeguard.constraints) {
          if (!constraints.includes(c)) {
            constraints.push(c);
          }
        }
      }
      if (!improvements.includes(safeguard.improvementText)) {
        improvements.push(safeguard.improvementText);
      }
    }
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

  // Universal Production Constraints (Zero-Stub & Anti-Hallucination Guarantees)
  constraints.push('ZERO-STUB DIRECTIVE: Emit complete, production-ready, unbroken code. NEVER output comments like "// TODO: implement logic", "// Add remaining routes here", "/* handle other cases */", or "...rest of code". Every function, test, and type definition must be fully written.');
  constraints.push('ANTI-HALLUCINATION GUARD: Use only verified, stable library packages, methods, and types. Do not invent non-existent helper methods, deprecated flags, or synthetic dependencies.');
  constraints.push('DEFENSIVE PROGRAMMING: All external boundaries (user inputs, network responses, file system reads, environment variables) must be defensively validated before property access.');
  improvements.push('Enforced Zero-Stub guarantee and anti-hallucination guardrails');

  // Concrete verification commands tailored to framework & useCase
  const verificationCmds = getVerificationCommands(framework, useCase);

  // Output format specification
  const outputFormat = `Provide the output in the following format:
1. **Architectural Overview & Key Decisions** (brief summary of patterns and trade-offs)
2. **Complete, Syntactically Valid Code Blocks** (fully typed, fully runnable, self-contained with all imports, mocks, and fixtures)
3. **Execution Instructions & Verification Commands**:
${verificationCmds.map(cmd => `   ${cmd}`).join('\n')}
4. **Resilience & Edge Cases Verification Checklist** (itemized confirmation matching the required edge cases)
5. **Anti-Regression Safeguards** (specific checks preventing future regressions)`;

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

  if (scrubResult.hasSecrets) {
    improvements.unshift(`🛡️ Redacted ${scrubResult.totalCount} sensitive credential(s) (${scrubResult.detectedSecrets.map(s => s.type).join(', ')}) to prevent token exposure`);
  }

  const executionForecast = generateExecutionForecast({
    rawPrompt: sanitizedPrompt,
    useCase,
    framework,
    improvements,
    verificationCmds,
    projectContext
  });

  return {
    originalPrompt: rawPrompt,
    enhancedPrompt,
    useCase,
    targetModel,
    tone,
    framework,
    projectContext,
    executionForecast,
    scrubbedSecrets: scrubResult.hasSecrets ? scrubResult.detectedSecrets : undefined,
    clarityScoreBefore: analysis.clarityScore,
    clarityScoreAfter: 98,
    improvements,
    detectedVariables: analysis.detectedVariables,
    timestamp: Date.now(),
    engineUsed: 'offline-smart-template'
  };
}
