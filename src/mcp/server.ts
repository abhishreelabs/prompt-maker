import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { enhancePromptOffline } from '../engine/offlineEnhancer.ts';
import { analyzeBadPrompt, inferUseCase } from '../engine/promptAnalyzer.ts';
import { detectLocalWorkspace } from '../engine/workspaceDetector.ts';
import { USE_CASES } from '../data/useCases.ts';
import { LEARNED_USER_PROMPTS } from '../data/learnedPrompts.ts';
import type { UseCaseId, TargetModel, PromptTone } from '../types/index.ts';

export function createPromptMakerServer() {
  const server = new McpServer({
    name: 'prompt-maker',
    version: '0.1.0'
  });

  // Tool 1: enhance_developer_prompt
  server.tool(
    'enhance_developer_prompt',
    'Converts rough or brief developer drafts into production-grade, edge-case-proof AI prompts with personas, deterministic locators, auto-waits, and output schemas.',
    {
      raw_prompt: z.string().describe('The rough or incomplete developer prompt (e.g. "test login form with email & password" or "check better stack dns failure")'),
      use_case: z.enum([
        'ui-testing',
        'unit-testing',
        'bug-fixing',
        'code-refactoring',
        'feature-implementation',
        'api-design',
        'code-review',
        'db-optimization',
        'devops-docker',
        'devops-infra',
        'security-privacy',
        'secrets-observability',
        'healthcare-doctor',
        'image-generation',
        'concurrency-scaling',
        'webrtc-video',
        'pdf-document-ai',
        'social-automation',
        'iot-terrace-farming',
        'multi-tenant-branding',
        'state-cache-invalidation',
        'monorepo-branch-split',
        'mobile-touch-qa',
        'local-cloud-emulation',
        'patent-compliance',
        'general-developer'
      ] as const).optional().describe('The engineering domain category (defaults to auto-detected)'),
      framework: z.string().optional().describe('Target tech stack or framework (e.g. "Playwright (TypeScript)", "Next.js 16", "Cloudflare DNS", "Django REST")'),
      target_model: z.enum(['claude', 'gpt4o', 'gemini', 'cursor'] as const).optional().describe('Format wrapper for target model: claude (XML tags), gpt4o (markdown), gemini (grounding), cursor (.cursorrules style)'),
      tone: z.enum(['production', 'crisp', 'step-by-step', 'qa-adversarial'] as const).optional().describe('Prompt tone and rigor')
    },
    async ({ raw_prompt, use_case, framework, target_model = 'claude', tone = 'production' }) => {
      const effectiveUseCase = (use_case as UseCaseId) || inferUseCase(raw_prompt);
      // Auto-detect framework & workspace context if not provided
      const selectedUseCase = USE_CASES.find(u => u.id === effectiveUseCase);
      const localWorkspace = detectLocalWorkspace();
      const effectiveFramework = framework || (effectiveUseCase === 'general-developer' && localWorkspace ? localWorkspace.techStack : selectedUseCase?.defaultFramework || 'TypeScript');
      const effectiveProjectContext = localWorkspace ? localWorkspace.summary : undefined;

      const result = enhancePromptOffline({
        rawPrompt: raw_prompt,
        useCase: effectiveUseCase,
        targetModel: target_model as TargetModel,
        tone: tone as PromptTone,
        framework: effectiveFramework,
        projectContext: effectiveProjectContext
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                enhanced_prompt: result.enhancedPrompt,
                clarity_score_before: result.clarityScoreBefore,
                clarity_score_after: result.clarityScoreAfter,
                improvements: result.improvements,
                use_case: result.useCase,
                target_model: result.targetModel,
                framework: result.framework,
                project_context: result.projectContext,
                execution_forecast: result.executionForecast,
                detected_variables: result.detectedVariables
              },
              null,
              2
            )
          }
        ]
      };
    }
  );

  // Tool 2: analyze_developer_prompt
  server.tool(
    'analyze_developer_prompt',
    'Audits a raw developer prompt to diagnose why standard AI models will struggle with it (detects missing accessible locators, missing auto-waits, missing network stubs, missing boundary checks).',
    {
      raw_prompt: z.string().describe('The developer prompt to audit'),
      use_case: z.enum([
        'ui-testing',
        'unit-testing',
        'bug-fixing',
        'code-refactoring',
        'feature-implementation',
        'api-design',
        'code-review',
        'db-optimization',
        'devops-docker',
        'devops-infra',
        'security-privacy',
        'secrets-observability',
        'healthcare-doctor',
        'image-generation',
        'concurrency-scaling',
        'webrtc-video',
        'pdf-document-ai',
        'social-automation',
        'iot-terrace-farming',
        'multi-tenant-branding',
        'state-cache-invalidation',
        'monorepo-branch-split',
        'mobile-touch-qa',
        'local-cloud-emulation',
        'patent-compliance',
        'general-developer'
      ] as const).optional().describe('The engineering domain category')
    },
    async ({ raw_prompt, use_case }) => {
      const effectiveUseCase = (use_case as UseCaseId) || inferUseCase(raw_prompt);
      const analysis = analyzeBadPrompt(raw_prompt, effectiveUseCase);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                clarity_score: analysis.clarityScore,
                word_count: analysis.wordCount,
                detected_keywords: analysis.detectedKeywords,
                missing_architectural_elements: analysis.missingElements,
                vulnerabilities_summary: analysis.missingElements.length > 0
                  ? `Your draft lacks ${analysis.missingElements.length} critical safeguards. AI models are prone to hallucinating brittle selectors, arbitrary sleep() timeouts, or missing negative paths.`
                  : 'Your prompt is reasonably structured.'
              },
              null,
              2
            )
          }
        ]
      };
    }
  );

  // Tool 3: get_learned_workflows
  server.tool(
    'get_learned_workflows',
    'Retrieves real-world developer workflows extracted from production environments (Realtime Messaging, Healthcare Systems, Cloud SRE, Document AI, IoT) with exact problem context and safeguards.',
    {
      project_filter: z.string().optional().describe('Optional filter by project or domain name (e.g. "Messaging", "Healthcare", "Cloud", "Video")'),
      category: z.string().optional().describe('Optional filter by category (e.g. "ui-testing", "devops-infra", "security-privacy")')
    },
    async ({ project_filter, category }) => {
      let filtered = LEARNED_USER_PROMPTS;

      if (project_filter) {
        filtered = filtered.filter(p => p.project.toLowerCase().includes(project_filter.toLowerCase()));
      }

      if (category) {
        filtered = filtered.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(filtered, null, 2)
          }
        ]
      };
    }
  );

  // Tool 4: list_supported_use_cases
  server.tool(
    'list_supported_use_cases',
    'Lists all 16 supported engineering domains, their descriptions, default frameworks, and key hardening checklists.',
    {},
    async () => {
      const list = USE_CASES.map(u => ({
        id: u.id,
        name: u.name,
        description: u.description,
        default_framework: u.defaultFramework,
        suggested_frameworks: u.suggestedFrameworks,
        key_checklist: u.keyChecklist
      }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(list, null, 2)
          }
        ]
      };
    }
  );

  // MCP Prompt: harden-prompt
  server.prompt(
    'harden-prompt',
    'Harden any developer task into an elite prompt',
    {
      task: z.string().describe('The task or feature you want to prompt AI to build')
    },
    async ({ task }) => {
      const enhanced = enhancePromptOffline({
        rawPrompt: task,
        useCase: 'general-developer',
        targetModel: 'claude',
        tone: 'production',
        framework: 'TypeScript'
      });

      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: enhanced.enhancedPrompt
            }
          }
        ]
      };
    }
  );

  return server;
}

export async function runStdioServer() {
  const server = createPromptMakerServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Prompt Maker MCP Server running on stdio');
}
