import type { LearnedPromptItem } from '../types/index.ts';

export const LEARNED_USER_PROMPTS: LearnedPromptItem[] = [
  // 1. Mobile & UI Testing (WhisperRoom & HMS)
  {
    id: 'learned-mobile-qa',
    project: 'WhisperRoom / HMS Landing',
    category: 'ui-testing',
    rawUserPrompt: 'is propelry tested for mobile as it will be used much in mobile',
    context: 'Next.js 16 + Tailwind responsive web app for ephemeral chat & mobile landing page.',
    targetStack: 'Playwright (Mobile Viewport Emulation)',
    whyItFailedBefore: 'AI wrote generic desktop tests with full-screen coordinates, ignoring touch targets, virtual keyboard occlusion, viewport clipping, and dynamic orientation changes.',
    keyUpgrades: [
      'Emulate mobile devices (iPhone 14 / Pixel 7 viewports)',
      'Touch target size assertions (minimum 44x44px per WCAG)',
      'Keyboard popup viewport shrink simulation',
      'Drawer and navigation bar touch gestures',
      'No hardcoded click coordinates'
    ]
  },
  {
    id: 'learned-card-layout-diff',
    project: 'Hospital Management System',
    category: 'ui-testing',
    rawUserPrompt: 'why card layout if differnet',
    context: 'Hospital landing page doctor cards rendering inconsistently across desktop and mobile browsers.',
    targetStack: 'Playwright + Visual Regression / CSS Audit',
    whyItFailedBefore: 'AI guessed without inspecting CSS flexbox/grid wrapper properties, break-inside properties, and image aspect-ratio discrepancies.',
    keyUpgrades: [
      'CSS Grid vs Flexbox alignment inspection criteria',
      'Visual screenshot regression testing with maxDiffPixels threshold',
      'Card content overflow and variable length doctor bios',
      'Multi-device responsive breakpoint verification (sm, md, lg)'
    ]
  },
  {
    id: 'learned-chatbot-appointment',
    project: 'Virtual Doctor / HMS',
    category: 'healthcare-doctor',
    rawUserPrompt: 'can you test now the virtual doctior on landing page. can we book appointment from landing page chatbot for doing the booking',
    context: 'Interactive virtual doctor triage widget that guides patient through symptoms and books slot.',
    targetStack: 'Playwright E2E + Mock Triage API',
    whyItFailedBefore: 'AI generated a standard click test that skipped conversational state machine verification, slot conflict edge cases, and medical disclaimer requirements.',
    keyUpgrades: [
      'Multi-turn conversational state machine assertions',
      'Calendar slot reservation & double-booking race condition checks',
      'HIPAA/patient privacy consent checkbox validation',
      'Network mocking of backend triage endpoint (/api/v1/doctor/triage)'
    ]
  },

  // 2. DevOps, Cloudflare, Better Stack & Render
  {
    id: 'learned-betterstack-dns',
    project: 'Abhishree Sentinel / Labs',
    category: 'devops-infra',
    rawUserPrompt: 'chekc better stack we are getting dns lookup failure',
    context: 'Better Stack uptime heartbeat alerts failing due to Cloudflare DNS resolution / TTL.',
    targetStack: 'Cloudflare DNS + Better Stack Heartbeat Script',
    whyItFailedBefore: 'AI answered "check your internet" instead of diagnosing Cloudflare Proxy (orange vs grey cloud), DNS CNAME flattening, SSL edge certs, and TTL propagation.',
    keyUpgrades: [
      'DNS diagnostic procedure (dig +trace, nslookup, WHOIS)',
      'Cloudflare Proxied vs DNS-Only (Grey Cloud) toggle check for uptime pings',
      'Better Stack HTTP status vs TCP/ICMP ping configuration',
      'Automated fallback endpoint & alert webhook notifications'
    ]
  },
  {
    id: 'learned-upstash-redis-inactivity',
    project: 'WhisperRoom / Sentinel',
    category: 'devops-infra',
    rawUserPrompt: 'upstack redis goes down due to inactivityu can we setup in betterstack or uptiem which we had',
    context: 'Free-tier Upstash Redis or Render sleeping after periods of inactivity, dropping chat sessions.',
    targetStack: 'Node.js / Cloudflare Worker Cron + Better Stack',
    whyItFailedBefore: 'AI suggested paying for enterprise Redis rather than creating an automated lightweight ping/keep-alive cron worker.',
    keyUpgrades: [
      'Zero-cost automated keep-alive cron job (every 10 minutes)',
      'Exponential backoff reconnection logic on Redis client error',
      'Better Stack health check integration for Redis REST ping',
      'Graceful degradation when Redis wakes up from cold start'
    ]
  },
  {
    id: 'learned-free-tier-deployment',
    project: 'WhisperRoom',
    category: 'devops-infra',
    rawUserPrompt: 'whichver cost me nothing we cannot keep in ram correct? what to deploy and test it',
    context: 'Deploying real-time WebSockets & ephemeral chat on zero-cost infrastructure.',
    targetStack: 'Render Free Tier + Cloudflare DNS / Pages',
    whyItFailedBefore: 'AI recommended expensive AWS ECS / ALB setups that cost $50+/month.',
    keyUpgrades: [
      'Zero-cost architecture (Render Web Service + Cloudflare DNS CNAME)',
      'Handling Render 15-minute sleep with client-side reconnection banners',
      'In-memory RingBuffer / Map with automatic TTL expiry to stay within RAM limits',
      'Web-first deployment checklist with custom domain SSL'
    ]
  },

  // 3. Security, Privacy & Ephemeral Chat
  {
    id: 'learned-security-privacy-expert',
    project: 'WhisperRoom / Interview Portal',
    category: 'security-privacy',
    rawUserPrompt: 'Lets find all security and vunerability and privacy issues. Les e an expert and ffind them',
    context: 'Ephemeral chat with room passcodes, image sharing, and host door knock approval.',
    targetStack: 'OWASP / WebRTC / Socket.io Security Review',
    whyItFailedBefore: 'AI listed generic Wikipedia summaries of XSS rather than pinpointing code-level vulnerabilities in WebSockets, room traversal, and token forgery.',
    keyUpgrades: [
      'Socket.io room authorization & unauthorized broadcast prevention',
      'XSS sanitization in markdown & plain text message payloads',
      'Timing-attack safe passcode comparison (crypto.timingSafeEqual)',
      'Rate limiting & DDoS protection per IP on socket connection',
      'Ephemeral memory wipe verification (zero traces on disk/logs)'
    ]
  },
  {
    id: 'learned-zero-trace-burn',
    project: 'WhisperRoom',
    category: 'security-privacy',
    rawUserPrompt: 'how many users we can add in single chat... what about privacy if somebdy share image what happened to them they should burn',
    context: '10-second auto-burn photo & text countdown, host approval doorway.',
    targetStack: 'Client-side Decryption + In-Memory Auto-Purge',
    whyItFailedBefore: 'AI suggested storing images on AWS S3, violating the zero-trace, no-storage requirement.',
    keyUpgrades: [
      'In-memory ArrayBuffer storage with strict setTimeout purge',
      'Client-side Canvas rendering with disabled right-click and copy',
      'Client countdown timer synchronization with server-authoritative burn signal',
      'Prevent browser disk caching via Cache-Control: no-store, private'
    ]
  },

  // 4. Secret Management & Infisical Sync
  {
    id: 'learned-infisical-secrets',
    project: 'Abhishree Studio / Sentinel',
    category: 'secrets-observability',
    rawUserPrompt: 'do u know the infiscal ? if ye sthen we have abhishree-sentil or abhishreelabs in that we have render key you can use it to setup render',
    context: 'Syncing secrets across dev/prod environments and deploying via Infisical CLI.',
    targetStack: 'Infisical CLI + Render API + Cloudflare Tokens',
    whyItFailedBefore: 'AI assumed hardcoded .env files and leaked instructions for manual copy-pasting rather than programmatic Infisical CLI commands.',
    keyUpgrades: [
      'Infisical CLI programmatic command scripts (infisical export / run)',
      'Strict environment scoping (dev vs prod vs local)',
      'Automated push to Render environment variables via Render API',
      'Zero secrets in git or build logs verification'
    ]
  },

  // 5. Sentry Observability & Error Tracing
  {
    id: 'learned-sentry-integration',
    project: 'WhisperRoom / Interview Portal',
    category: 'secrets-observability',
    rawUserPrompt: 'is there anything we cna add for this Sentry or any service which can be good for Sentry i hav eadded sentry_token in infiscal',
    context: 'End-to-end production error tracking and performance monitoring for Next.js.',
    targetStack: 'Sentry Next.js SDK + Infisical SENTRY_AUTH_TOKEN',
    whyItFailedBefore: 'AI omitted source map upload configuration and PII sanitization in error breadcrumbs.',
    keyUpgrades: [
      'Complete next.config.ts withSentryConfig wrapper',
      'Client, server, and edge runtime Sentry init files',
      'Automatic PII stripping (scrubbing user passwords, tokens, chat texts)',
      'Infisical Sentry auth token injection during CI build'
    ]
  },

  // 6. Concurrency & Scaling
  {
    id: 'learned-scale-n-users',
    project: 'WhisperRoom / Interview Portal',
    category: 'concurrency-scaling',
    rawUserPrompt: 'how we are going to deal with n number of session and how we can deal with n user in a session?',
    context: 'Real-time WebSocket server handling concurrent chat rooms and live candidate interviews.',
    targetStack: 'Socket.io Cluster + Redis Adapter + Memory Profiling',
    whyItFailedBefore: 'AI gave vague answers about load balancers without explaining sticky sessions, Socket.io Redis adapter, and socket memory footprint.',
    keyUpgrades: [
      'Socket.io Redis Streams / Redis Adapter architecture',
      'Sticky session cookie configuration for reverse proxy (Nginx / Cloudflare)',
      'Socket connection heartbeat and zombie client cleanup timeout',
      'Memory footprint calculation per connected client (~15KB/socket)'
    ]
  },

  // 7. Automated Content & Image Prompt Packs
  {
    id: 'learned-terrace-farming-prompts',
    project: 'Terrace Farming / Social Automation',
    category: 'image-generation',
    rawUserPrompt: 'create all 30 ready-to-run prompts matching the authentic 14-section Muli/Palak/Methi reference for terrace farming',
    context: 'Generating hyper-detailed infographic visual prompts for agricultural terrace gardening.',
    targetStack: 'Structured Prompt Generator (Hindi + English) + Midjourney / Imagen',
    whyItFailedBefore: 'AI generated generic stock photo descriptions with no crop timing, Hindi steps, soil ratios, or realistic Indian rooftop terrace details.',
    keyUpgrades: [
      'Bilingual content specification (Hindi steps + English visual prompt)',
      'Exact potting soil ratio formulas (40% loam + 30% vermicompost + 20% cocopeat + 10% sand)',
      'Photorealistic prompt keywords (morning dew, terracotta pots, 8K, authentic rooftop garden)',
      'Crop timeline, germination days, and harvest cycles table'
    ]
  }
];
