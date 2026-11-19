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
    name: 'DevOps & Dockerfiles',
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
    id: 'devops-infra',
    name: 'Cloudflare, Render & DNS Ops',
    icon: 'Cloud',
    description: 'Learned from Abhishree Sentinel & Labs: Diagnose DNS lookup failures, CNAME routing, Better Stack uptime, and Render deployments.',
    defaultFramework: 'Cloudflare DNS + Render API',
    suggestedFrameworks: ['Cloudflare DNS + Render API', 'Better Stack Uptime', 'Upstash Redis Keep-Alive', 'CNAME / SSL Mapping'],
    associatedProject: 'Abhishree Sentinel / Labs / WhisperRoom',
    sampleBadPrompts: [
      {
        title: 'Better Stack DNS error',
        prompt: 'chekc better stack we are getting dns lookup failure',
        suggestedStack: 'Cloudflare DNS + Better Stack Heartbeat Script',
        sourceProject: 'Abhishree Sentinel'
      },
      {
        title: 'Upstash Redis Inactivity Sleep',
        prompt: 'upstack redis goes down due to inactivityu can we setup in betterstack or uptiem which we had',
        suggestedStack: 'Cloudflare Worker Cron + Better Stack',
        sourceProject: 'WhisperRoom'
      },
      {
        title: 'Zero-Cost Deployment',
        prompt: 'whichver cost me nothing we cannot keep in ram correct? what to deploy and test it',
        suggestedStack: 'Render Free Tier + Cloudflare DNS',
        sourceProject: 'WhisperRoom'
      }
    ],
    keyChecklist: [
      'Cloudflare Orange vs Grey Cloud (Proxy vs DNS only) audit',
      'Better Stack HTTP heartbeat vs TCP ping setup',
      'Zero-cost keep-alive cron job to prevent free-tier sleep',
      'Custom domain SSL certificate propagation and CNAME flattening'
    ]
  },
  {
    id: 'security-privacy',
    name: 'Security, Privacy & Zero-Trace',
    icon: 'Lock',
    description: 'Learned from WhisperRoom & Interview Portal: Code-level vulnerability audits, RAM-only ephemeral storage, and auto-burn countdowns.',
    defaultFramework: 'OWASP / Socket.io / WebRTC',
    suggestedFrameworks: ['OWASP Top 10', 'Socket.io Auth', 'Memory Zeroing', 'End-to-End Encryption (E2EE)'],
    associatedProject: 'WhisperRoom / Interview Portal',
    sampleBadPrompts: [
      {
        title: 'Full Security & Privacy Audit',
        prompt: 'Lets find all security and vunerability and privacy issues. Les e an expert and ffind them',
        suggestedStack: 'OWASP WebSockets & Node Audit',
        sourceProject: 'WhisperRoom'
      },
      {
        title: 'View Once & Auto-Burn Media',
        prompt: 'how many users we can add in single chat... what about privacy if somebdy share image what happened to them they should burn',
        suggestedStack: 'Client Decryption + In-Memory Wipe',
        sourceProject: 'WhisperRoom'
      }
    ],
    keyChecklist: [
      'Zero-trace in-memory storage (no database, no disk cache)',
      'Timing-safe cryptographic comparisons for room passcodes',
      'Socket room authorization and injection sanitization',
      'Client countdown auto-burn with server-authoritative signal'
    ]
  },
  {
    id: 'secrets-observability',
    name: 'Infisical Secrets & Sentry Tracing',
    icon: 'Key',
    description: 'Learned from Abhishree Studio & Sentinel: Automated secret synchronization via Infisical and production error tracking with Sentry.',
    defaultFramework: 'Infisical CLI + Sentry Next.js',
    suggestedFrameworks: ['Infisical CLI', 'Sentry Next.js SDK', 'Render API Tokens', 'GitHub Action Secrets'],
    associatedProject: 'Abhishree Studio / Sentinel / WhisperRoom',
    sampleBadPrompts: [
      {
        title: 'Sync Infisical Keys to Render',
        prompt: 'do u know the infiscal ? if ye sthen we have abhishree-sentil or abhishreelabs in that we have render key you can use it to setup render',
        suggestedStack: 'Infisical CLI + Render API',
        sourceProject: 'Abhishree Studio'
      },
      {
        title: 'Integrate Sentry Error Tracking',
        prompt: 'is there anything we cna add for this Sentry or any service which can be good for Sentry i hav eadded sentry_token in infiscal',
        suggestedStack: 'Sentry Next.js SDK + Infisical',
        sourceProject: 'WhisperRoom'
      }
    ],
    keyChecklist: [
      'Infisical programmatic secret pulling across dev/local/prod',
      'Sentry next.config.ts wrapper with source map upload',
      'Automatic PII scrubbing in error breadcrumbs and stack traces',
      'Zero plaintext secrets in source code or CI build artifacts'
    ]
  },
  {
    id: 'healthcare-doctor',
    name: 'Virtual Doctor & Health Triage',
    icon: 'Stethoscope',
    description: 'Learned from Hospital Management & Virtual Doctor: Patient symptom triage, appointment booking chatbots, and hospital white-labeling.',
    defaultFramework: 'Django REST + Next.js + Triage API',
    suggestedFrameworks: ['Django REST Framework', 'Next.js 16', 'Symptom Triage Chatbot', 'HIPAA Privacy Guard'],
    associatedProject: 'Hospital Management System / Virtual Doctor Core',
    sampleBadPrompts: [
      {
        title: 'Chatbot Appointment Booking Flow',
        prompt: 'can you test now the virtual doctior on landing page. can we book appointment from landing page chatbot for doing the booking',
        suggestedStack: 'Playwright E2E + Triage API',
        sourceProject: 'Virtual Doctor'
      },
      {
        title: 'Fix White-Labeling Branding Leak',
        prompt: 'change it as vedant hospital is not our name that was client name why wedant websit eis coming ?',
        suggestedStack: 'Multi-Tenant Config / Supabase',
        sourceProject: 'Hospital Vedant'
      }
    ],
    keyChecklist: [
      'Conversational symptom triage state machine with clinical safety disclaimers',
      'Doctor calendar slot locking to prevent double booking',
      'Tenant brand isolation (dynamic themes, logos, and domains)',
      'Patient health data encryption in transit and at rest'
    ]
  },
  {
    id: 'image-generation',
    name: 'AI Infographics & Image Prompts',
    icon: 'Palette',
    description: 'Learned from Terrace Farming & AI Social Automation: Generate rich bilingual infographic visual prompts with precise composition.',
    defaultFramework: 'Bilingual Prompt Generator (Imagen / Midjourney)',
    suggestedFrameworks: ['Midjourney v6', 'Google Imagen 3', 'Bilingual English/Hindi Matrix', 'Creative Director Brief'],
    associatedProject: 'Terrace Farming / AI Social Automation',
    sampleBadPrompts: [
      {
        title: '30-Day Terrace Farming Infographic',
        prompt: 'create all 30 ready-to-run prompts matching the authentic 14-section Muli/Palak/Methi reference for terrace farming',
        suggestedStack: 'Terrace Farming Infographic Spec',
        sourceProject: 'Terrace Farming'
      }
    ],
    keyChecklist: [
      'Bilingual content layout (authentic Hindi steps + English imagery)',
      'Exact potting soil ratio formulas (vermicompost, cocopeat, sand)',
      'Negative constraints (no distorted text, no cartoonish look, authentic lighting)',
      'Aspect ratio specifications (4:5 social media or 16:9 banner)'
    ]
  },
  {
    id: 'concurrency-scaling',
    name: 'Concurrency & Session Scaling',
    icon: 'Zap',
    description: 'Learned from WhisperRoom & Interview Portal: Real-time WebSockets, handling N concurrent rooms/users, and Redis clustering.',
    defaultFramework: 'Socket.io Cluster + Redis Adapter',
    suggestedFrameworks: ['Socket.io Redis Adapter', 'Node.js Cluster', 'Sticky Session Load Balancing', 'Memory Profiling'],
    associatedProject: 'WhisperRoom / Interview Portal',
    sampleBadPrompts: [
      {
        title: 'Handle N Users & Sessions',
        prompt: 'how we are going to deal with n number of session and how we can deal with n user in a session?',
        suggestedStack: 'Socket.io Redis Adapter + Node Cluster',
        sourceProject: 'WhisperRoom'
      }
    ],
    keyChecklist: [
      'Socket.io Redis adapter for cross-node message broadcasting',
      'Reverse proxy sticky session cookies (Cloudflare / Nginx)',
      'Per-client memory overhead bounds (~15KB per connection)',
      'Heartbeat timeout & zombie connection pruning'
    ]
  },
  {
    id: 'webrtc-video',
    name: 'WebRTC Video & Live Interview QA',
    icon: 'Video',
    description: 'Learned from Interview Portal: Real-time peer-to-peer video/audio calling, ICE candidate STUN/TURN negotiation, and screen sharing.',
    defaultFramework: 'WebRTC + Socket.io + MediaStream',
    suggestedFrameworks: ['WebRTC (Simple-Peer)', 'Socket.io Signaling', 'STUN/TURN (Coturn)', 'Canvas Stream Recording'],
    associatedProject: 'Interview Portal',
    sampleBadPrompts: [
      {
        title: 'Video Freezing in Interview',
        prompt: 'candidate video is freezing during live technical interview fix audio video desync',
        suggestedStack: 'WebRTC PeerConnection + Socket.io',
        sourceProject: 'Interview Portal'
      },
      {
        title: 'Screen Sharing with Tab Audio',
        prompt: 'add screen sharing toggle to webrtc video call with tab audio capture and fallback',
        suggestedStack: 'MediaStream API + WebRTC',
        sourceProject: 'Interview Portal'
      }
    ],
    keyChecklist: [
      'ICE candidate gathering timeout & TURN server relay fallback',
      'Bandwidth renegotiation & dynamic bitrate adaptation on packet loss',
      'Auto-reconnect on socket disconnect without dropping active media tracks',
      'Microphone/Camera permission denial graceful recovery dialog'
    ]
  },
  {
    id: 'pdf-document-ai',
    name: 'PDF Extraction & Exam Analytics',
    icon: 'FileText',
    description: 'Learned from ExamAnalytics AI: Parsing scanned question papers, OCR deskewing, LaTeX equation extraction, and rubric grading.',
    defaultFramework: 'Python / pdfplumber / Tesseract OCR',
    suggestedFrameworks: ['pdfplumber / PyPDF2', 'Tesseract OCR + OpenCV', 'FastAPI + Pydantic', 'KaTeX / LaTeX Parser'],
    associatedProject: 'ExamAnalytics AI',
    sampleBadPrompts: [
      {
        title: 'Extract MCQ Questions from Scanned PDF',
        prompt: 'extract questions and mcq options from scanned question paper pdf into json with answer keys',
        suggestedStack: 'Python / pdfplumber / Pydantic',
        sourceProject: 'ExamAnalytics AI'
      },
      {
        title: 'Handwritten Answer Sheet Evaluation',
        prompt: 'evaluate student handwritten answer sheet against rubric and output marks breakdown and feedback',
        suggestedStack: 'OCR + Vision LLM Evaluation',
        sourceProject: 'ExamAnalytics AI'
      }
    ],
    keyChecklist: [
      'OpenCV document deskewing and contrast thresholding for low-DPI scans',
      'LaTeX mathematical equation preservation inside question stems',
      'Strict Pydantic JSON schema output with question-by-question scoring',
      'Streaming page-by-page processing preventing memory exhaustion on 100+ page PDFs'
    ]
  },
  {
    id: 'social-automation',
    name: 'Social Media Automation & Bot APIs',
    icon: 'Share2',
    description: 'Learned from AI Social Automation: Scheduled social publishing, OAuth 2.0 PKCE token refresh, rate-limit backoff, and chunked uploads.',
    defaultFramework: 'Node.js + Twitter API v2 + LinkedIn REST',
    suggestedFrameworks: ['Twitter API v2', 'LinkedIn REST API', 'BullMQ Redis Queue', 'OAuth 2.0 PKCE'],
    associatedProject: 'AI Social Automation',
    sampleBadPrompts: [
      {
        title: 'LinkedIn Scheduled Post with Image',
        prompt: 'schedule linkedin post with image and handle oauth token refresh automatically in background',
        suggestedStack: 'LinkedIn REST API + BullMQ',
        sourceProject: 'AI Social Automation'
      },
      {
        title: 'Twitter Thread Publisher with Rate Limits',
        prompt: 'bot to publish twitter thread with rate limit backoff and error retry when api is throttled',
        suggestedStack: 'Twitter API v2 (Node.js)',
        sourceProject: 'AI Social Automation'
      }
    ],
    keyChecklist: [
      'OAuth 2.0 token rotation with proactive refresh before access token expiration',
      'Rate-limit handling with exponential jitter honoring x-rate-limit-reset headers',
      'Chunked asynchronous media upload protocol (INIT, APPEND, FINALIZE, STATUS)',
      'Idempotent job queue execution preventing duplicate post broadcasts'
    ]
  },
  {
    id: 'iot-terrace-farming',
    name: 'Smart Agriculture & IoT Telemetry',
    icon: 'Sprout',
    description: 'Learned from Terrace Farming Smart Assistant: Soil moisture telemetry, potting soil ratios, weather-aware irrigation, and crop disease diagnosis.',
    defaultFramework: 'ESP32 / MQTT / Next.js / Weather API',
    suggestedFrameworks: ['MQTT Client / Mosquitto', 'OpenWeatherMap API', 'Soil Moisture Calibration', 'Plant Disease Classifier'],
    associatedProject: 'Terrace Farming Smart Assistant',
    sampleBadPrompts: [
      {
        title: 'Weather-Aware Smart Irrigation',
        prompt: 'smart irrigation rule based on soil moisture sensor readings and rain forecast to avoid overwatering',
        suggestedStack: 'MQTT Telemetry + Weather API Rule Engine',
        sourceProject: 'Terrace Farming'
      },
      {
        title: 'Crop Disease Image Diagnosis',
        prompt: 'plant leaf disease image diagnosis with organic treatment and fertilizer recommendation',
        suggestedStack: 'Mobile Vision + Agronomy Expert Prompt',
        sourceProject: 'Terrace Farming'
      }
    ],
    keyChecklist: [
      'Exact potting soil ratio formulas (vermicompost, cocopeat, perlite, neem khali)',
      'Weather-aware delay: suppress watering when precipitation probability > 60%',
      'MQTT QoS 1 message persistence for intermittent Wi-Fi sensor dropouts',
      'Multilingual localized agronomy guidance (Hindi and English)'
    ]
  },
  {
    id: 'multi-tenant-branding',
    name: 'Multi-Tenant White-Labeling & Routing',
    icon: 'Layers',
    description: 'Learned from Hospital Vedant & Life Platform: Dynamic subdomain/custom domain host routing, tenant CSS theming, and database data isolation.',
    defaultFramework: 'Next.js Middleware + Prisma / PostgreSQL RLS',
    suggestedFrameworks: ['Next.js Edge Middleware', 'PostgreSQL Row Level Security', 'CSS Variables Theming', 'Subdomain Multi-tenancy'],
    associatedProject: 'Hospital Vedant / Life Platform',
    sampleBadPrompts: [
      {
        title: 'Custom Domain Clinic Branding',
        prompt: 'configure custom domain routing so clinic1.com and clinic2.com show their own hospital logo and theme',
        suggestedStack: 'Next.js Middleware + Dynamic Theme Provider',
        sourceProject: 'Hospital Vedant'
      },
      {
        title: 'Cross-Tenant Data Leak Prevention',
        prompt: 'ensure tenant A doctors cannot see tenant B patient records in database queries or search APIs',
        suggestedStack: 'PostgreSQL Row Level Security (RLS) + Prisma',
        sourceProject: 'Hospital Management System'
      }
    ],
    keyChecklist: [
      'Edge Middleware hostname inspection and tenant resolution without DB roundtrips',
      'PostgreSQL Row Level Security (RLS) policies scoped strictly to current tenant_id',
      'Dynamic CSS variable palette injection with zero flashing of unstyled content (FOUC)',
      'Fallback brand presets when accessing via unmapped custom domains'
    ]
  },
  {
    id: 'state-cache-invalidation',
    name: 'Real-Time State Sync & Cache Tuning',
    icon: 'RefreshCw',
    description: 'Learned from Hospital Management System: Diagnosing stale React Query caches, optimistic update rollbacks, and write-after-read lag.',
    defaultFramework: 'React Query (TanStack Query) + WebSocket',
    suggestedFrameworks: ['TanStack Query v5', 'SWR', 'Zustand Store Invalidation', 'Optimistic UI Updates'],
    associatedProject: 'Hospital Management System',
    sampleBadPrompts: [
      {
        title: 'Patient Added Not Showing in List',
        prompt: 'why pateint Abhishek Sahu which i added why its not coming. does it has to be reloaded ?',
        suggestedStack: 'TanStack Query (React Query) Cache Invalidation',
        sourceProject: 'Hospital Management System'
      },
      {
        title: 'Optimistic Appointment Cancellation',
        prompt: 'cancel appointment optimistically in ui with instant rollback and toast notification on server error',
        suggestedStack: 'React Query useMutation onMutate / onError',
        sourceProject: 'Hospital Management System'
      }
    ],
    keyChecklist: [
      'Targeted query cache invalidation (queryClient.invalidateQueries) matching exact query key tags',
      'Optimistic snapshot capture and rolling back previous query data on mutation failure',
      'Write-after-read consistency checks preventing stale replica reading right after inserts',
      'StaleTime and gcTime tuning to prevent unnecessary background network spamming'
    ]
  },
  {
    id: 'monorepo-branch-split',
    name: 'Monorepo & Branch Architecture Separation',
    icon: 'GitBranch',
    description: 'Learned from HMS Landing vs Staff Portal: Isolating public landing pages from internal staff apps, code sharing, and bundle hygiene.',
    defaultFramework: 'Turborepo / pnpm Workspaces / Next.js',
    suggestedFrameworks: ['Turborepo', 'pnpm Workspaces', 'Nx', 'Bundle Analyzer'],
    associatedProject: 'HMS Landing Page / HMS Portal',
    sampleBadPrompts: [
      {
        title: 'Separate Landing Page from Staff Portal',
        prompt: 'i dont understand we have created landing-page branch and that suppose to have landing and staff code has to go somewhere else separate it',
        suggestedStack: 'Turborepo Apps Separation (Landing vs Staff)',
        sourceProject: 'Hospital Management System'
      },
      {
        title: 'Shared Component Library Hygiene',
        prompt: 'share ui components between landing page and admin dashboard in a clean monorepo without leaking admin code',
        suggestedStack: 'pnpm Workspace Shared UI Package',
        sourceProject: 'HMS Landing Page'
      }
    ],
    keyChecklist: [
      'Clean package workspace separation: apps/landing (public) and apps/portal (internal)',
      'Strict export boundaries preventing private staff credentials or types from bundling into public web',
      'Next.js bundle analyzer check ensuring landing page JavaScript bundle remains under 150KB',
      'Shared design system UI package (@workspace/ui) with peer dependency deduplication'
    ]
  },
  {
    id: 'mobile-touch-qa',
    name: 'Mobile Touch Target & Viewport QA',
    icon: 'Smartphone',
    description: 'Learned from WhisperRoom & HMS: WCAG 2.1 touch target compliance, virtual keyboard viewport squishing, and drawer touch gestures.',
    defaultFramework: 'Playwright Mobile Emulation + WCAG 2.1',
    suggestedFrameworks: ['Playwright (iPhone 14 / Pixel 7)', 'axe-core Touch Audit', 'Visual Viewport API', 'Mobile Gestures Emulation'],
    associatedProject: 'WhisperRoom / HMS Landing Page',
    sampleBadPrompts: [
      {
        title: 'Mobile Virtual Keyboard Squish Layout',
        prompt: 'is propelry tested for mobile as it will be used much in mobile what happens when keyboard opens',
        suggestedStack: 'Playwright Mobile Viewport + Keyboard Simulation',
        sourceProject: 'WhisperRoom'
      },
      {
        title: 'Touch Target & Navigation Bar Audit',
        prompt: 'audit touch target sizes on navigation bar and buttons for mobile compliance so thumbs can tap easily',
        suggestedStack: 'Playwright + WCAG Touch Target 44px Check',
        sourceProject: 'HMS Landing Page'
      }
    ],
    keyChecklist: [
      'Minimum 44x44 CSS pixel touch target bounding box assertions per WCAG 2.1 Success Criterion 2.5.5',
      'Visual Viewport API (window.visualViewport) simulation when soft keyboard expands on mobile',
      'Safe-area-inset padding (env(safe-area-inset-bottom)) assertions preventing iOS home bar overlaps',
      'Touch event gesture testing (swipe-to-dismiss, drawer drag) with zero coordinate hardcoding'
    ]
  },
  {
    id: 'local-cloud-emulation',
    name: 'Local Cloud & Floci/AWS Emulation',
    icon: 'Cloud',
    description: 'Learned from AWS Local Cost Optimization: Running local S3, DynamoDB, and IAM using Floci/LocalStack without incurring cloud charges.',
    defaultFramework: 'Floci / LocalStack / AWS SDK v3',
    suggestedFrameworks: ['Floci Local AWS', 'LocalStack Community', 'Docker Compose', 'AWS SDK v3 Endpoint Overrides'],
    associatedProject: 'Abhishree Sentinel / Labs',
    sampleBadPrompts: [
      {
        title: 'Local AWS S3 & DynamoDB with Floci',
        prompt: 'can we use https://github.com/floci-io/floci for aws for local to avoid paying any cloud bills',
        suggestedStack: 'Floci Local AWS + Docker Compose',
        sourceProject: 'Abhishree Labs'
      },
      {
        title: 'AWS SDK Endpoint Overrides for Local Testing',
        prompt: 'configure local aws credentials and endpoint overrides for s3 upload testing in dev without hitting real aws',
        suggestedStack: 'AWS SDK v3 + Local S3 Bucket Provisioning',
        sourceProject: 'Abhishree Labs'
      }
    ],
    keyChecklist: [
      'Docker Compose service configuration for Floci / LocalStack with local persistence volume',
      'AWS SDK v3 client initialization with custom endpoint override (http://localhost:4566)',
      'Automated bucket provisioning initialization script (awslocal s3 mb s3://local-bucket)',
      'S3 presigned URL generation compatibility with local localhost vs container network hosts'
    ]
  },
  {
    id: 'patent-compliance',
    name: 'Patent, IP & Commercial Adoption',
    icon: 'Scale',
    description: 'Learned from ExamAnalytics AI: Aligning codebase architecture with patent claims/drawings and auditing copyleft open-source licenses.',
    defaultFramework: 'Software IP Compliance & License Audit',
    suggestedFrameworks: ['License-Checker CLI', 'Patent Claim Mapping', 'Clean-Room Architecture', 'FOSSA / Snyk License'],
    associatedProject: 'ExamAnalytics AI',
    sampleBadPrompts: [
      {
        title: 'Align Code with Patent Description & Drawings',
        prompt: 'i have pasted Description English-3.pdf Drawings English-4.pdf can you check if our project is alligned with patent adoption and commertial use',
        suggestedStack: 'Patent Architecture Alignment Matrix',
        sourceProject: 'ExamAnalytics AI'
      },
      {
        title: 'GPL / Copyleft Dependency Audit',
        prompt: 'scan all npm and python packages to make sure zero copyleft gpl licenses are present for commercial software release',
        suggestedStack: 'License-Checker + Dependency Audit',
        sourceProject: 'ExamAnalytics AI'
      }
    ],
    keyChecklist: [
      'Strict license auditing: filter out AGPL-3.0, GPL-2.0/3.0, prioritizing MIT, Apache 2.0, BSD-3-Clause',
      'Traceability matrix linking patent claim paragraphs to specific software modules and algorithms',
      'Clean-room architectural boundary documentation ensuring independent development proof',
      'Verification that all third-party SDKs permit commercial redistribution without viral source disclosure'
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
