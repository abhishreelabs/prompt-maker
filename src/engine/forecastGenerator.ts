import type { UseCaseId, ExecutionForecast } from '../types/index.ts';

interface ForecastParams {
  rawPrompt: string;
  useCase: UseCaseId;
  framework: string;
  improvements: string[];
  verificationCmds: string[];
  projectContext?: string;
}

export function generateExecutionForecast(params: ForecastParams): ExecutionForecast {
  const { framework, verificationCmds, projectContext } = params;

  const stackLabel = projectContext || framework || 'Current Tech Stack';

  // Domain-tailored pitfalls
  const pitfalls: string[] = [
    'Emits lazy stubs (e.g. "// TODO: implement logic here", "// add remaining routes")',
    'Guesses architecture without validating against actual project conventions',
    'Omits boundary and negative tests, leading to silent runtime crashes on edge cases',
    'No automated test verification commands run to guarantee regression safety'
  ];

  // Domain-tailored action plan
  const actionPlan: string[] = [
    `Context Alignment: Inspects and aligns with target architecture (${stackLabel})`,
    'Zero-Stub Code Generation: Writes 100% complete, runnable implementation with zero placeholders',
    'Defensive Boundary Enforcement: Wraps inputs and external I/O with schema validation & error handlers',
    'Automated Verification: Executes test & build commands to ensure zero regressions'
  ];

  const enforcedGuarantees: string[] = [
    'Zero-Stub Directive: Banned from emitting partial code or TODO comments',
    'Anti-Hallucination Guard: Restricted to stable, verified package APIs',
    'Type Safety Contract: Enforces strict typing and schema validation across all boundaries',
    'Verification Assertions: Requires terminal verification commands to pass cleanly'
  ];

  return {
    withoutHardening: {
      behavior: 'Agent acts as a conversational chatbot, guessing intent and skipping structural constraints.',
      likelyPitfalls: pitfalls,
      expectedOutcome: 'High risk of broken code, missing imports, lazy stubs, and failed manual integration.'
    },
    withHardening: {
      agentActionPlan: actionPlan,
      enforcedGuarantees,
      verificationCommands: verificationCmds,
      expectedOutcome: 'Production-ready, directly mergeable code that satisfies typechecks and automated tests on the first run.'
    }
  };
}
