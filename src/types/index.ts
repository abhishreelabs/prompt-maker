export type UseCaseId =
  | 'ui-testing'
  | 'unit-testing'
  | 'bug-fixing'
  | 'code-refactoring'
  | 'feature-implementation'
  | 'api-design'
  | 'code-review'
  | 'db-optimization'
  | 'devops-docker'
  | 'general-developer';

export type TargetModel = 'claude' | 'gpt4o' | 'gemini' | 'cursor';

export type PromptTone = 'production' | 'crisp' | 'step-by-step' | 'qa-adversarial';

export interface UseCaseDefinition {
  id: UseCaseId;
  name: string;
  icon: string;
  description: string;
  defaultFramework: string;
  suggestedFrameworks: string[];
  sampleBadPrompts: {
    title: string;
    prompt: string;
    suggestedStack: string;
  }[];
  keyChecklist: string[];
}

export interface PromptTransformationResult {
  originalPrompt: string;
  enhancedPrompt: string;
  useCase: UseCaseId;
  targetModel: TargetModel;
  tone: PromptTone;
  framework?: string;
  clarityScoreBefore: number; // 0-100
  clarityScoreAfter: number; // 0-100
  improvements: string[];
  detectedVariables: { key: string; defaultValue: string }[];
  timestamp: number;
  engineUsed: 'offline-smart-template' | 'gemini-ai' | 'openai-ai';
}

export interface SettingsState {
  geminiApiKey: string;
  openaiApiKey: string;
  defaultModel: TargetModel;
  preferredEngine: 'hybrid' | 'offline-only';
}
