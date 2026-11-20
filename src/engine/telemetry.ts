/**
 * Zero-PII Telemetry Service for Prompt Maker
 *
 * Privacy Guarantees:
 * 1. NEVER transmits raw prompt text, code, or personal data.
 * 2. Only sends metadata: domain category, clarity score deltas, detected defect types,
 *    and number of neutralized secrets.
 * 3. Gracefully degrades if offline or network is unreachable.
 */

export interface TelemetryEvent {
  domain: string;
  targetFramework?: string;
  targetModel?: string;
  clarityBefore: number;
  clarityAfter: number;
  defectsDetected?: string[];
  invariantsInjected?: string[];
  secretsScrubbedCount?: number;
  wordCount?: number;
  userAction?: 'compile' | 'copy' | 'feedback_positive' | 'feedback_negative' | 'export';
  generationMode?: 'offline_heuristic' | 'ai_gemini' | 'ai_openai';
}

export interface LearningSummary {
  total_prompts: number;
  avg_clarity_gain: number;
  total_secrets_guarded: number;
}

export interface LearningDomainStat {
  domain: string;
  count: number;
}

export interface LearningRecentActivity {
  domain: string;
  target_model: string;
  clarity_before: number;
  clarity_after: number;
  clarity_delta: number;
  user_action: string;
  created_at: string;
}

export interface LearningStatsResponse {
  success: boolean;
  summary: LearningSummary;
  domains: LearningDomainStat[];
  recent: LearningRecentActivity[];
}

export async function sendTelemetry(event: TelemetryEvent): Promise<boolean> {
  try {
    const payload = JSON.stringify({
      domain: event.domain || 'general',
      targetFramework: event.targetFramework || 'crispe',
      targetModel: event.targetModel || 'general',
      clarityBefore: event.clarityBefore,
      clarityAfter: event.clarityAfter,
      defectsDetected: event.defectsDetected || [],
      invariantsInjected: event.invariantsInjected || [],
      secretsScrubbedCount: event.secretsScrubbedCount || 0,
      wordCount: event.wordCount || 0,
      userAction: event.userAction || 'compile',
      generationMode: event.generationMode || 'offline_heuristic',
    });

    // Check if we are running in browser
    if (typeof window === 'undefined') return false;

    // Use fetch with keepalive for reliability on page navigation
    const res = await fetch('/api/telemetry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
      keepalive: true,
    });

    return res.ok;
  } catch {
    // Fail silently without disrupting user workflow
    return false;
  }
}

export async function fetchLearningStats(): Promise<LearningStatsResponse | null> {
  try {
    const res = await fetch('/api/telemetry');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
