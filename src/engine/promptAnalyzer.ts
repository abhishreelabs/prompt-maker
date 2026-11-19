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
  }

  // Detect technical keywords
  const techRegex = /\b(playwright|cypress|selenium|jest|vitest|react|next\.?js|vue|angular|node|express|fastapi|python|typescript|javascript|postgres|sql|prisma|docker|kubernetes|graphql|rest|tailwind|css|html)\b/gi;
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
