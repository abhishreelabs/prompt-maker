import type { UseCaseDefinition } from '../types/index.ts';

export const USE_CASES: UseCaseDefinition[] = [
  {
    id: 'ui-testing',
    name: 'UI & E2E Testing',
    icon: 'TestTube2',
    description: 'Transform vague test requests into resilient, flake-free end-to-end tests with resilient locators and a11y checks.',
    defaultFramework: 'Playwright (TypeScript)',
    suggestedFrameworks: ['Playwright (TypeScript)', 'Cypress', 'Vitest + Testing Library', 'Puppeteer', 'Selenium Webdriver'],
    sampleBadPrompts: [
      {
        title: 'Login form test',
        prompt: 'test the login form with email and password and check if error shows up when invalid',
        suggestedStack: 'Playwright (TypeScript)'
      },
      {
        title: 'Checkout flow',
        prompt: 'write automated ui tests for shopping cart checkout and stripe payment flow',
        suggestedStack: 'Playwright (TypeScript)'
      },
      {
        title: 'Modal & Table testing',
        prompt: 'test user table sorting, search filter and the edit user modal pop up',
        suggestedStack: 'Cypress'
      }
    ],
    keyChecklist: [
      'Role-based accessible locators (getByRole, getByLabel)',
      'Deterministic waiting & zero arbitrary sleep()',
      'Positive, negative & boundary matrix',
      'Network mocking / API route stubbing',
      'Accessibility (a11y) & keyboard navigation'
    ]
  },
  {
    id: 'unit-testing',
    name: 'Unit & Integration Testing',
    icon: 'CheckCircle2',
    description: 'Turn requests for unit tests into complete test suites with mocked dependencies, edge cases, and table-driven tests.',
    defaultFramework: 'Vitest / Jest',
    suggestedFrameworks: ['Vitest / Jest', 'PyTest', 'Go testing', 'JUnit 5', 'RSpec'],
    sampleBadPrompts: [
      {
        title: 'Auth token helper test',
        prompt: 'write unit tests for this jwt verification and token refresh helper function',
        suggestedStack: 'Vitest / Jest'
      },
      {
        title: 'Discount calculator test',
        prompt: 'test discount calculation logic including edge cases like zero and negative numbers',
        suggestedStack: 'PyTest'
      }
    ],
    keyChecklist: [
      'Isolated mocks for external I/O & databases',
      'Table-driven / parameterized test cases',
      'Boundary conditions (null, undefined, max bounds)',
      'Asynchronous error rejections & timeout assertions',
      '100% branch and edge-case coverage'
    ]
  },
  {
    id: 'bug-fixing',
    name: 'Bug Reproduction & Root Cause',
    icon: 'Bug',
    description: 'Stop getting generic guesses. Force AI to hypothesize root causes, ask for logs, and provide regression-safe fixes.',
    defaultFramework: 'Node.js / React',
    suggestedFrameworks: ['React / Next.js', 'Node.js / Express', 'Python / FastAPI', 'TypeScript', 'PostgreSQL'],
    sampleBadPrompts: [
      {
        title: 'Infinite re-render bug',
        prompt: 'my react component keeps re-rendering infinitely in useEffect fix it',
        suggestedStack: 'React / Next.js'
      },
      {
        title: 'Memory leak in node',
        prompt: 'memory usage goes up constantly after 2 hours in my node express server why',
        suggestedStack: 'Node.js / Express'
      }
    ],
    keyChecklist: [
      'Step-by-step reproduction sequence',
      'Hypothesis generation & verification steps',
      'Minimal reproducible example (MRE)',
      'Regression test to prevent recurrence',
      'Impact analysis on adjacent modules'
    ]
  },
  {
    id: 'code-refactoring',
    name: 'Refactoring & Optimization',
    icon: 'Wrench',
    description: 'Transform messy spaghetti code into modular, typed, performant, and clean code following SOLID principles.',
    defaultFramework: 'TypeScript',
    suggestedFrameworks: ['TypeScript', 'Python', 'Go', 'Rust', 'Java'],
    sampleBadPrompts: [
      {
        title: 'Refactor giant controller',
        prompt: 'this order controller file is 1000 lines clean it up and make it faster',
        suggestedStack: 'TypeScript'
      },
      {
        title: 'Optimize slow loop',
        prompt: 'this data processing loop is very slow with 50000 items make it efficient',
        suggestedStack: 'Python'
      }
    ],
    keyChecklist: [
      'Preserve existing behavior and public API contract',
      'Time and Space Complexity target (O(n))',
      'Extract Single-Responsibility Services',
      'Strict TypeScript interfaces & type safety',
      'Side-by-side Before/After diff'
    ]
  },
  {
    id: 'feature-implementation',
    name: 'Feature Implementation',
    icon: 'Sparkles',
    description: 'Convert informal feature ideas into bulletproof technical specifications, types, error states, and implementation steps.',
    defaultFramework: 'Next.js + TypeScript',
    suggestedFrameworks: ['Next.js + TypeScript', 'React + Tailwind', 'FastAPI + Pydantic', 'NestJS', 'Go Gin'],
    sampleBadPrompts: [
      {
        title: 'Dark mode toggle',
        prompt: 'add a dark mode toggle to my navbar with system preference sync',
        suggestedStack: 'React + Tailwind'
      },
      {
        title: 'Rate limiter middleware',
        prompt: 'add rate limiting to my express api with redis to stop abuse',
        suggestedStack: 'Node.js / Express'
      }
    ],
    keyChecklist: [
      'Architecture & data flow diagram/spec',
      'Strict schema/types definition',
      'Loading, empty, error, and success states',
      'Security & permission validation',
      'Step-by-step code implementation'
    ]
  },
  {
    id: 'api-design',
    name: 'REST / GraphQL API Design',
    icon: 'Network',
    description: 'Design idempotent, secure, and self-documenting APIs with Zod/Pydantic validation and RFC 7807 error responses.',
    defaultFramework: 'TypeScript / OpenAPI',
    suggestedFrameworks: ['TypeScript / OpenAPI', 'FastAPI', 'Express + Zod', 'GraphQL / Apollo', 'tRPC'],
    sampleBadPrompts: [
      {
        title: 'Subscription webhook API',
        prompt: 'make an api endpoint to receive stripe billing webhooks and update user plan',
        suggestedStack: 'TypeScript / OpenAPI'
      },
      {
        title: 'Pagination & search endpoint',
        prompt: 'design a rest endpoint for filtering and paginating product listings',
        suggestedStack: 'FastAPI'
      }
    ],
    keyChecklist: [
      'Idempotency keys and replay protection',
      'Standardized RFC 7807 problem details',
      'Request & response schemas with validation',
      'Pagination (cursor vs offset) & filtering',
      'Authentication & Scope-based authorization'
    ]
  },
  {
    id: 'code-review',
    name: 'Code Review & Security Audit',
    icon: 'ShieldCheck',
    description: 'Prompt AI to behave like a rigorous Principal Engineer reviewing code for OWASP vulnerabilities and edge-case leaks.',
    defaultFramework: 'Fullstack / Security',
    suggestedFrameworks: ['Fullstack / Security', 'Frontend React', 'Backend Node/Python', 'Smart Contracts'],
    sampleBadPrompts: [
      {
        title: 'Review auth PR',
        prompt: 'check this authentication logic for any security issues or bugs',
        suggestedStack: 'Fullstack / Security'
      },
      {
        title: 'Review file upload code',
        prompt: 'look at this s3 file upload function and tell me if its secure',
        suggestedStack: 'Backend Node/Python'
      }
    ],
    keyChecklist: [
      'OWASP Top 10 vulnerabilities (XSS, CSRF, Injection)',
      'Race conditions and concurrency issues',
      'Resource leaks and unhandled promise rejections',
      'Missing validation & type casting gotchas',
      'Actionable diffs with prioritized severity levels'
    ]
  },
  {
    id: 'db-optimization',
    name: 'Database & SQL Optimization',
    icon: 'Database',
    description: 'Get deep query execution plans, indexing strategies, connection pool tuning, and N+1 prevention.',
    defaultFramework: 'PostgreSQL / SQL',
    suggestedFrameworks: ['PostgreSQL / SQL', 'MySQL', 'Prisma ORM', 'MongoDB', 'Redis'],
    sampleBadPrompts: [
      {
        title: 'Slow user dashboard query',
        prompt: 'my postgres query joining users orders and payments is super slow fix it',
        suggestedStack: 'PostgreSQL / SQL'
      },
      {
        title: 'Prisma N+1 query problem',
        prompt: 'prisma is doing 100 queries when loading user comments how to batch',
        suggestedStack: 'Prisma ORM'
      }
    ],
    keyChecklist: [
      'EXPLAIN ANALYZE interpretation',
      'Composite and partial indexing strategies',
      'N+1 query eradication & batch loading',
      'Lock contention and transaction isolation',
      'Migration script with rollback support'
    ]
  },
  {
    id: 'devops-docker',
    name: 'DevOps, Docker & CI/CD',
    icon: 'Terminal',
    description: 'Generate multi-stage, rootless, cached Dockerfiles and hardened GitHub Actions workflows.',
    defaultFramework: 'GitHub Actions + Docker',
    suggestedFrameworks: ['GitHub Actions + Docker', 'Kubernetes Helm', 'Terraform', 'AWS CDK', 'Cloudflare Workers'],
    sampleBadPrompts: [
      {
        title: 'Dockerize Next.js app',
        prompt: 'write a dockerfile for my nextjs app that is small in size',
        suggestedStack: 'GitHub Actions + Docker'
      },
      {
        title: 'CI test workflow',
        prompt: 'make a github action that runs tests and linter on every pull request',
        suggestedStack: 'GitHub Actions + Docker'
      }
    ],
    keyChecklist: [
      'Multi-stage build with minimal runtime base image',
      'Non-root user execution (security hardening)',
      'Layer caching optimization for fast builds',
      'Secret management (no hardcoded secrets)',
      'Health check endpoint and graceful shutdown'
    ]
  },
  {
    id: 'general-developer',
    name: 'General Developer Task',
    icon: 'Code2',
    description: 'Elevate any arbitrary programming question into an impeccably structured, constraint-rich prompt.',
    defaultFramework: 'General',
    suggestedFrameworks: ['General', 'TypeScript', 'Python', 'Go', 'Rust'],
    sampleBadPrompts: [
      {
        title: 'Explain algorithm',
        prompt: 'explain how raft consensus works with code examples',
        suggestedStack: 'General'
      },
      {
        title: 'Regex for URL matching',
        prompt: 'give me a regex that validates urls including query parameters and ports',
        suggestedStack: 'General'
      }
    ],
    keyChecklist: [
      'Precise technical persona and domain expertise',
      'Specific inputs, expected outputs and invariants',
      'Anti-hallucination constraints',
      'Edge cases and exceptional conditions',
      'Syntactically valid, self-contained solution'
    ]
  }
];
