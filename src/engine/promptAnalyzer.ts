import type { UseCaseId } from '../types/index.ts';

export interface PromptAnalysis {
  clarityScore: number;
  wordCount: number;
  detectedKeywords: string[];
  missingElements: string[];
  detectedVariables: { key: string; defaultValue: string }[];
}

export function analyzeBadPrompt(prompt: string, useCase: UseCaseId): PromptAnalysis {
  const clean = prompt.trim();
  const words = clean ? clean.split(/\s+/) : [];
  const wordCount = words.length;

  const missingElements: string[] = [];
  let score = 20;

  // Check length & specificity
  if (wordCount < 5) {
    missingElements.push('Extremely brief; lacks context and specifications');
    score = Math.max(10, wordCount * 3);
  } else if (wordCount < 15) {
    missingElements.push('Lacks technical detail and boundary constraints');
    score = 25 + wordCount;
  } else {
    score = Math.min(48, 25 + Math.floor(wordCount * 0.8));
  }

  // Check for role
  if (!/\b(act as|you are|role|engineer|architect|specialist|expert)\b/i.test(clean)) {
    missingElements.push('No expert role / persona established');
  } else {
    score += 8;
  }

  // Check for edge cases
  if (!/\b(edge case|error|fail|invalid|timeout|exception|null|boundary|empty|reject)\b/i.test(clean)) {
    missingElements.push('No edge cases, negative tests, or failure handlers specified');
  } else {
    score += 8;
  }

  // Check for output format
  if (!/\b(format|output|typescript|json|markdown|table|diff|schema|step by step|code only)\b/i.test(clean)) {
    missingElements.push('No explicit output structure or deliverables requested');
  } else {
    score += 8;
  }

  // Use-case specific checks
  if (useCase === 'ui-testing') {
    if (!/\b(selector|locator|wait|click|assert|expect|page|screen|role|getByRole|aria)\b/i.test(clean)) {
      missingElements.push('No locator strategy (accessible getByRole vs fragile CSS)');
    }
    if (!/\b(network|mock|api|fixture|route|intercept)\b/i.test(clean)) {
      missingElements.push('No network mocking / API response isolation mentioned');
    }
    if (!/\b(a11y|accessibility|keyboard|contrast|tab)\b/i.test(clean)) {
      missingElements.push('No accessibility (a11y) or keyboard navigation assertions');
    }
  } else if (useCase === 'unit-testing') {
    if (!/\b(mock|stub|spy|parameterized|table|coverage|isolate)\b/i.test(clean)) {
      missingElements.push('No mock specifications for external dependencies/IO');
    }
  } else if (useCase === 'bug-fixing') {
    if (!/\b(reproduce|stack trace|expected|actual|root cause|log)\b/i.test(clean)) {
      missingElements.push('No reproduction steps, environment info, or error logs provided');
    }
  } else if (useCase === 'api-design') {
    if (!/\b(status code|idempotent|schema|zod|validation|header|rfc)\b/i.test(clean)) {
      missingElements.push('Missing HTTP status codes, schema validation, and error contract');
    }
  } else if (useCase === 'devops-infra') {
    if (!/\b(dns|ttl|cname|proxy|better stack|uptime|cloudflare|probe|heartbeat)\b/i.test(clean)) {
      missingElements.push('No DNS probe diagnostics, TTL caching, or Cloudflare proxy status analyzed');
    }
    if (!/\b(keep-alive|cron|free tier|inactivity|sleep)\b/i.test(clean)) {
      missingElements.push('No keep-alive cron strategy specified for free-tier inactivity sleep');
    }
  } else if (useCase === 'security-privacy') {
    if (!/\b(ram|memory|zero-trace|ephemeral|burn|wipe|timing|safe)\b/i.test(clean)) {
      missingElements.push('No Zero-Trace memory lifecycle or client auto-burn synchronization specified');
    }
    if (!/\b(owasp|xss|sanitize|token|auth|doorbell|knock)\b/i.test(clean)) {
      missingElements.push('Missing WebSocket room authorization & XSS payload injection defenses');
    }
  } else if (useCase === 'secrets-observability') {
    if (!/\b(infisical|infiscal|cli|export|run|sentry|dsn|pii|token)\b/i.test(clean)) {
      missingElements.push('Missing programmatic Infisical secret management and Sentry PII scrubbing');
    }
  } else if (useCase === 'healthcare-doctor') {
    if (!/\b(disclaimer|triage|state machine|hipaa|double booking|slot|white-label)\b/i.test(clean)) {
      missingElements.push('Missing clinical safety disclaimer, appointment race condition lock, and tenant isolation');
    }
  } else if (useCase === 'concurrency-scaling') {
    if (!/\b(redis|adapter|sticky|cluster|memory|footprint|heartbeat|prune)\b/i.test(clean)) {
      missingElements.push('Missing Socket.io Redis adapter horizontal scaling and sticky-session proxy configuration');
    }
  } else if (useCase === 'image-generation') {
    if (!/\b(bilingual|hindi|english|ratio|soil|negative|aspect|4:5)\b/i.test(clean)) {
      missingElements.push('Missing bilingual layout specs, precise technical ratios, and negative quality weights');
    }
  }

  // Detect technical keywords including workspace tools
  const techRegex = /\b(playwright|cypress|selenium|jest|vitest|react|next\.?js|vue|angular|node|express|fastapi|python|typescript|javascript|postgres|sql|prisma|docker|kubernetes|graphql|rest|tailwind|css|html|cloudflare|render|better stack|betterstack|infisical|infiscal|sentry|socket\.io|webrtc|upstash|upstack|redis|neon|supabase|django)\b/gi;
  const matches = clean.match(techRegex) || [];
  const detectedKeywords = Array.from(new Set(matches.map(m => m.toLowerCase())));

  // Detect variables like {{var}} or [var]
  const varRegex = /\{\{([a-zA-Z0-9_-]+)\}\}/g;
  const detectedVariables: { key: string; defaultValue: string }[] = [];
  let match;
  while ((match = varRegex.exec(clean)) !== null) {
    if (!detectedVariables.some(v => v.key === match![1])) {
      detectedVariables.push({ key: match[1], defaultValue: '' });
    }
  }

  return {
    clarityScore: Math.min(50, Math.max(10, score)),
    wordCount,
    detectedKeywords,
    missingElements,
    detectedVariables
  };
}

export function inferUseCase(text: string): UseCaseId {
  const t = text.toLowerCase();
  if (t.includes('webrtc') || t.includes('video call') || t.includes('screen share') || t.includes('ice candidate')) {
    return 'webrtc-video';
  }
  if (t.includes('pdf') || t.includes('ocr') || /\bexams?\b/.test(t) || t.includes('scanned')) {
    return 'pdf-document-ai';
  }
  if (t.includes('social') || t.includes('linkedin') || t.includes('twitter') || t.includes('tweet') || t.includes('schedule post')) {
    return 'social-automation';
  }
  if (t.includes('farming') || t.includes('terrace') || t.includes('soil') || t.includes('irrigation') || t.includes('plant')) {
    return 'iot-terrace-farming';
  }
  if (t.includes('white label') || t.includes('tenant') || t.includes('custom domain') || t.includes('clinic1') || t.includes('branding')) {
    return 'multi-tenant-branding';
  }
  if (t.includes('stale') || t.includes('cache') || t.includes('react query') || t.includes('not showing up') || t.includes('optimistic')) {
    return 'state-cache-invalidation';
  }
  if (t.includes('monorepo') || t.includes('branch split') || t.includes('landing page branch') || t.includes('staff portal')) {
    return 'monorepo-branch-split';
  }
  if (t.includes('touch target') || t.includes('virtual keyboard') || t.includes('mobile web') || t.includes('iphone') || t.includes('touch')) {
    return 'mobile-touch-qa';
  }
  if (t.includes('floci') || t.includes('localstack') || t.includes('local aws') || t.includes('s3 local')) {
    return 'local-cloud-emulation';
  }
  if (t.includes('patent') || t.includes('gpl') || t.includes('copyleft') || t.includes('license audit') || t.includes('claims')) {
    return 'patent-compliance';
  }
  if (t.includes('dns') || t.includes('uptime') || t.includes('cloudflare') || t.includes('render') || t.includes('better stack')) {
    return 'devops-infra';
  }
  if (t.includes('docker') || t.includes('dockerfile') || t.includes('container') || t.includes('k8s') || t.includes('kubernetes')) {
    return 'devops-docker';
  }
  if (t.includes('sql') || t.includes('database') || t.includes('postgres') || t.includes('prisma') || t.includes('query')) {
    return 'db-optimization';
  }
  if (t.includes('api') || t.includes('endpoint') || t.includes('rest') || t.includes('webhook') || t.includes('graphql')) {
    return 'api-design';
  }
  if (t.includes('unit test') || t.includes('coverage') || t.includes('mock') || t.includes('jest') || t.includes('vitest')) {
    return 'unit-testing';
  }
  if (t.includes('playwright') || t.includes('cypress') || t.includes('e2e') || t.includes('locator') || (t.includes('test') && !t.includes('unit'))) {
    return 'ui-testing';
  }
  if (t.includes('bug') || t.includes('fix') || t.includes('error') || t.includes('leak') || t.includes('failing') || t.includes('why')) {
    return 'bug-fixing';
  }
  if (t.includes('refactor') || t.includes('clean up') || t.includes('solid')) {
    return 'code-refactoring';
  }
  if (t.includes('security') || t.includes('vulnerability') || t.includes('privacy') || t.includes('zero-trace') || t.includes('auto-burn')) {
    return 'security-privacy';
  }
  if (t.includes('infisical') || t.includes('sentry') || t.includes('secret') || t.includes('env key')) {
    return 'secrets-observability';
  }
  if (t.includes('doctor') || t.includes('patient') || t.includes('hospital') || t.includes('triage') || t.includes('appointment')) {
    return 'healthcare-doctor';
  }
  if (t.includes('image') || t.includes('infographic') || t.includes('midjourney') || t.includes('imagen')) {
    return 'image-generation';
  }
  if (t.includes('concurrency') || t.includes('websocket') || t.includes('socket.io') || t.includes('redis adapter')) {
    return 'concurrency-scaling';
  }
  if (t.includes('code review') || t.includes('pr review') || t.includes('audit')) {
    return 'code-review';
  }
  if (t.includes('create') || t.includes('implement') || t.includes('feature') || t.includes('add')) {
    return 'feature-implementation';
  }
  return 'general-developer';
}
