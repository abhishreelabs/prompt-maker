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

export const CLOUD_TELEMETRY_ENDPOINT = 'https://prompt-maker.abhishreelabs.in/api/telemetry';

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

    const isBrowser = typeof window !== 'undefined';
    const endpoint = isBrowser ? '/api/telemetry' : CLOUD_TELEMETRY_ENDPOINT;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
      signal: controller.signal,
      ...(isBrowser ? { keepalive: true } : {}),
    });

    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    // Fail silently without disrupting user workflow
    return false;
  }
}

export async function fetchLearningStats(endpointUrl?: string): Promise<LearningStatsResponse | null> {
  try {
    const isBrowser = typeof window !== 'undefined';
    const defaultUrl = isBrowser ? '/api/telemetry' : CLOUD_TELEMETRY_ENDPOINT;
    const targetUrl = endpointUrl || defaultUrl;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(targetUrl, {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
