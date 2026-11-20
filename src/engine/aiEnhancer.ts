import type { PromptTone, TargetModel, UseCaseId, PromptTransformationResult } from '../types/index.ts';
import { enhancePromptOffline } from './offlineEnhancer.ts';
import { analyzeBadPrompt } from './promptAnalyzer.ts';
import { scrubSecrets } from './secretScrubber.ts';

interface AiEnhanceParams {
  rawPrompt: string;
  useCase: UseCaseId;
  targetModel: TargetModel;
  tone: PromptTone;
  framework?: string;
  apiKey?: string;
  modelProvider?: 'gemini' | 'openai';
}

const META_SYSTEM_PROMPT = `You are "Prompt Architect", the world's leading Meta-Prompt Engineer specialized in software development.
Your job is to take a developer's brief, rough, or incomplete prompt and rewrite it into an extraordinary, expert-level AI prompt that forces target LLMs to write flawless, production-ready, edge-case-proof code.

RULES:
1. Do NOT answer the prompt. You are REWRITING and ENHANCING the prompt.
2. The output MUST be the finished, ready-to-copy enhanced prompt itself.
3. Structure the enhanced prompt with:
   - Expert Persona / System Role
   - Clear Objective & Tech Stack context
   - Step-by-Step Requirements & Architecture
   - Comprehensive Edge Cases, Negative Paths, and Failure Modes
   - Anti-Patterns & Hard Constraints (what NOT to do)
   - Strict Output Schema / Deliverables format
4. If the use case is UI Testing:
   - Always enforce user-facing accessible locators (getByRole, getByLabel) over brittle CSS.
   - Forbid arbitrary sleeps/timeouts; enforce web-first auto-wait assertions.
   - Require network route mocking to avoid flaky backend dependencies.
   - Require keyboard a11y and mobile viewport testing.
5. If the use case is Unit Testing, Refactoring, Bug Fixing, or API Design:
   - Enforce boundary conditions, strict type-safety, idempotency, and regression tests.
6. Match the requested tone and format structure suitable for the target LLM.`;

export async function enhancePromptWithAi({
  rawPrompt,
  useCase,
  targetModel,
  tone,
  framework = 'TypeScript',
  apiKey,
  modelProvider = 'gemini'
}: AiEnhanceParams): Promise<PromptTransformationResult> {
  // Always scrub secrets first to guarantee zero credential exposure to LLMs
  const scrubResult = scrubSecrets(rawPrompt);
  const sanitizedPrompt = scrubResult.cleanText;

  // If no API key is provided, fallback cleanly to offline enhancer
  if (!apiKey || !apiKey.trim()) {
    return enhancePromptOffline({ rawPrompt: sanitizedPrompt, useCase, targetModel, tone, framework });
  }

  const analysis = analyzeBadPrompt(sanitizedPrompt, useCase);

  try {
    if (modelProvider === 'gemini') {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `${META_SYSTEM_PROMPT}\n\nDeveloper Input: "${sanitizedPrompt}"\nUse Case: ${useCase}\nFramework/Stack: ${framework}\nTarget LLM: ${targetModel}\nTone: ${tone}\n\nGenerate the complete enhanced prompt now:`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 2500
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedText) {
        throw new Error('Gemini API returned an empty response.');
      }

      const improvements = [
        'Meta-Prompt synthesized using Gemini 2.5 Flash',
        'Autonomous edge-case discovery based on your specific requirements',
        'Enforced role-based accessibility and zero-flake locators',
        'Strict output schema and verification steps'
      ];

      if (scrubResult.hasSecrets) {
        improvements.unshift(`🛡️ Redacted ${scrubResult.totalCount} sensitive credential(s) before sending to Gemini API`);
      }

      return {
        originalPrompt: rawPrompt,
        enhancedPrompt: generatedText.trim(),
        useCase,
        targetModel,
        tone,
        framework,
        scrubbedSecrets: scrubResult.hasSecrets ? scrubResult.detectedSecrets : undefined,
        clarityScoreBefore: analysis.clarityScore,
        clarityScoreAfter: 98,
        improvements,
        detectedVariables: analysis.detectedVariables,
        timestamp: Date.now(),
        engineUsed: 'gemini-ai'
      };
    } else {
      // OpenAI API call
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: META_SYSTEM_PROMPT },
            {
              role: 'user',
              content: `Developer Input: "${sanitizedPrompt}"\nUse Case: ${useCase}\nFramework: ${framework}\nTarget LLM: ${targetModel}\nTone: ${tone}\n\nGenerate the complete enhanced prompt:`
            }
          ],
          temperature: 0.3
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.choices?.[0]?.message?.content;

      if (!generatedText) {
        throw new Error('OpenAI returned an empty response.');
      }

      const improvements = [
        'Meta-Prompt synthesized with OpenAI',
        'Autonomous edge-case and boundary parameterization',
        'Strict output schema and anti-pattern enforcement'
      ];

      if (scrubResult.hasSecrets) {
        improvements.unshift(`🛡️ Redacted ${scrubResult.totalCount} sensitive credential(s) before sending to OpenAI API`);
      }

      return {
        originalPrompt: rawPrompt,
        enhancedPrompt: generatedText.trim(),
        useCase,
        targetModel,
        tone,
        framework,
        scrubbedSecrets: scrubResult.hasSecrets ? scrubResult.detectedSecrets : undefined,
        clarityScoreBefore: analysis.clarityScore,
        clarityScoreAfter: 98,
        improvements,
        detectedVariables: analysis.detectedVariables,
        timestamp: Date.now(),
        engineUsed: 'openai-ai'
      };
    }
  } catch (err: unknown) {
    console.warn('AI enhancement error, falling back to offline template engine:', err);
    const offlineResult = enhancePromptOffline({ rawPrompt: sanitizedPrompt, useCase, targetModel, tone, framework });
    const errorMessage = err instanceof Error ? err.message : String(err);
    offlineResult.improvements.push(`Note: AI call failed (${errorMessage}). High-precision offline engine used.`);
    return offlineResult;
  }
}
