import type { LearnedPromptItem } from '../types/index.ts';
import { LEARNED_USER_PROMPTS } from '../data/learnedPrompts.ts';

export interface BlueprintsApiResponse {
  success: boolean;
  count: number;
  blueprints: LearnedPromptItem[];
  source: string;
}

export async function fetchBlueprintsFromD1(): Promise<{ blueprints: LearnedPromptItem[]; source: 'd1' | 'local' }> {
  try {
    if (typeof window === 'undefined') {
      return { blueprints: LEARNED_USER_PROMPTS, source: 'local' };
    }

    const res = await fetch('/api/blueprints');
    if (!res.ok) {
      return { blueprints: LEARNED_USER_PROMPTS, source: 'local' };
    }

    const data: BlueprintsApiResponse = await res.json();
    if (data.success && Array.isArray(data.blueprints) && data.blueprints.length > 0) {
      return { blueprints: data.blueprints, source: 'd1' };
    }

    return { blueprints: LEARNED_USER_PROMPTS, source: 'local' };
  } catch {
    // Offline / fallback to bundled blueprints
    return { blueprints: LEARNED_USER_PROMPTS, source: 'local' };
  }
}
