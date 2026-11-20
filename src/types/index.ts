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
  | 'devops-infra'
  | 'security-privacy'
  | 'secrets-observability'
  | 'healthcare-doctor'
  | 'image-generation'
  | 'concurrency-scaling'
  | 'webrtc-video'
  | 'pdf-document-ai'
  | 'social-automation'
  | 'iot-terrace-farming'
  | 'multi-tenant-branding'
  | 'state-cache-invalidation'
  | 'monorepo-branch-split'
  | 'mobile-touch-qa'
  | 'local-cloud-emulation'
  | 'patent-compliance'
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
  associatedProject?: string;
  sampleBadPrompts: {
    title: string;
    prompt: string;
    suggestedStack: string;
    sourceProject?: string;
  }[];
  keyChecklist: string[];
}

export interface LearnedPromptItem {
  id: string;
  project: string;
  category: UseCaseId;
  rawUserPrompt: string;
  context: string;
  targetStack: string;
  whyItFailedBefore: string;
  keyUpgrades: string[];
}

export interface ExecutionForecast {
  withoutHardening: {
    behavior: string;
    likelyPitfalls: string[];
    expectedOutcome: string;
  };
  withHardening: {
    agentActionPlan: string[];
    enforcedGuarantees: string[];
    verificationCommands: string[];
    expectedOutcome: string;
  };
}

export interface PromptTransformationResult {
  originalPrompt: string;
  enhancedPrompt: string;
  useCase: UseCaseId;
  targetModel: TargetModel;
  tone: PromptTone;
  framework?: string;
  projectContext?: string;
  executionForecast?: ExecutionForecast;
  scrubbedSecrets?: Array<{ type: string; count: number; placeholder: string }>;
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
  keyStorageMode?: 'session-only' | 'local-storage';
}

