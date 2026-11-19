import type { TargetModel } from '../types/index.ts';

export interface ModelPreset {
  id: TargetModel;
  name: string;
  badge: string;
  description: string;
  formatWrapper: (content: {
    role: string;
    objective: string;
    context: string;
    instructions: string[];
    edgeCases: string[];
    constraints: string[];
    outputFormat: string;
  }) => string;
}

export const MODEL_PRESETS: Record<TargetModel, ModelPreset> = {
  claude: {
    id: 'claude',
    name: 'Claude 3.7 / 3.5 Sonnet',
    badge: 'XML Tags Optimized',
    description: 'Uses Anthropic best-practice hierarchical XML tags for unmatched structural adherence.',
    formatWrapper: ({ role, objective, context, instructions, edgeCases, constraints, outputFormat }) => {
      return `<system>
You are an elite ${role}.
</system>

<objective>
${objective}
</objective>

<context>
${context}
</context>

<instructions>
${instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}
</instructions>

<edge_cases_and_resilience>
${edgeCases.map(ec => `- ${ec}`).join('\n')}
</edge_cases_and_resilience>

<strict_constraints>
${constraints.map(c => `- ${c}`).join('\n')}
</strict_constraints>

<output_format>
${outputFormat}
</output_format>`;
    }
  },

  gpt4o: {
    id: 'gpt4o',
    name: 'OpenAI GPT-4o / o3-mini',
    badge: 'Markdown Structured',
    description: 'Clear markdown hierarchy with strong system instructions and reasoning constraints.',
    formatWrapper: ({ role, objective, context, instructions, edgeCases, constraints, outputFormat }) => {
      return `### Role & Persona
Act as an expert **${role}**. Your objective is to deliver production-grade code adhering to modern standards.

### Objective
${objective}

### Technical Context & Assumptions
${context}

### Step-by-Step Requirements
${instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}

### Edge Cases & Defensive Engineering
${edgeCases.map(ec => `- [ ] ${ec}`).join('\n')}

### Explicit Constraints & Anti-Patterns
${constraints.map(c => `- ⚠️ ${c}`).join('\n')}

### Expected Output Delivery
${outputFormat}`;
    }
  },

  gemini: {
    id: 'gemini',
    name: 'Google Gemini 2.5 Pro / Flash',
    badge: 'Grounding & Directive',
    description: 'Explicit goal-directed formulation optimized for Gemini reasoning and multi-step synthesis.',
    formatWrapper: ({ role, objective, context, instructions, edgeCases, constraints, outputFormat }) => {
      return `[SYSTEM INSTRUCTION: DOMAIN EXPERT]
You are a senior ${role} with deep architectural and implementation knowledge.

[CORE TASK]
${objective}

[SPECIFICATION & CONTEXT]
${context}

[DETAILED EXECUTION PLAN]
${instructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}

[CRITICAL SCENARIOS TO HANDLE]
${edgeCases.map(ec => `* ${ec}`).join('\n')}

[RULES & CONSTRAINTS]
${constraints.map(c => `* MUST: ${c}`).join('\n')}

[OUTPUT SPECIFICATION]
${outputFormat}`;
    }
  },

  cursor: {
    id: 'cursor',
    name: 'Cursor / Copilot / Windsurf',
    badge: 'Concise Rules Format',
    description: 'Zero conversational fluff. Optimized for inline IDE code generation and .cursorrules.',
    formatWrapper: ({ role, objective, context, instructions, edgeCases, constraints, outputFormat }) => {
      return `# Context: ${role}
Target: ${objective}
Tech Stack: ${context}

## Guidelines:
${instructions.map(inst => `- ${inst}`).join('\n')}

## Edge Cases:
${edgeCases.map(ec => `- ${ec}`).join('\n')}

## Anti-Patterns:
${constraints.map(c => `- Avoid: ${c}`).join('\n')}

## Output:
${outputFormat}`;
    }
  }
};
