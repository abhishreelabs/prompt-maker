interface Env {
  DB: D1Database;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

interface TelemetryPayload {
  domain?: string;
  targetFramework?: string;
  targetModel?: string;
  clarityBefore?: number;
  clarityAfter?: number;
  defectsDetected?: string[];
  invariantsInjected?: string[];
  secretsScrubbedCount?: number;
  wordCount?: number;
  userAction?: string;
  generationMode?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;

    if (!env.DB) {
      return new Response(
        JSON.stringify({ success: false, error: 'Database binding DB not found' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload: TelemetryPayload = await request.json();

    // Zero-PII sanitization & bounds enforcement
    const domain = (payload.domain || 'general').slice(0, 50).trim();
    const targetFramework = (payload.targetFramework || 'crispe').slice(0, 30).trim();
    const targetModel = (payload.targetModel || 'general').slice(0, 50).trim();
    const clarityBefore = Math.max(0, Math.min(100, Math.round(Number(payload.clarityBefore) || 0)));
    const clarityAfter = Math.max(0, Math.min(100, Math.round(Number(payload.clarityAfter) || 0)));
    const defects = Array.isArray(payload.defectsDetected)
      ? payload.defectsDetected.map((d) => String(d).slice(0, 50)).slice(0, 20)
      : [];
    const invariants = Array.isArray(payload.invariantsInjected)
      ? payload.invariantsInjected.map((i) => String(i).slice(0, 100)).slice(0, 20)
      : [];
    const secretsScrubbedCount = Math.max(0, Math.round(Number(payload.secretsScrubbedCount) || 0));
    const wordCount = Math.max(0, Math.round(Number(payload.wordCount) || 0));
    const userAction = (payload.userAction || 'compile').slice(0, 30).trim();
    const generationMode = (payload.generationMode || 'offline_heuristic').slice(0, 30).trim();

    const id = crypto.randomUUID();

    await env.DB.prepare(
      `INSERT INTO prompt_insights (
        id, domain, target_framework, target_model,
        clarity_before, clarity_after,
        defects_detected, invariants_injected,
        secrets_scrubbed_count, word_count,
        user_action, generation_mode
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        domain,
        targetFramework,
        targetModel,
        clarityBefore,
        clarityAfter,
        JSON.stringify(defects),
        JSON.stringify(invariants),
        secretsScrubbedCount,
        wordCount,
        userAction,
        generationMode
      )
      .run();

    return new Response(
      JSON.stringify({ success: true, id, message: 'Telemetry telemetry recorded securely' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { env } = context;

    if (!env.DB) {
      return new Response(
        JSON.stringify({ success: false, error: 'Database binding DB not found' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const [totals, domains, recent] = await Promise.all([
      env.DB.prepare(
        `SELECT
          COUNT(*) as total_prompts,
          COALESCE(ROUND(AVG(clarity_delta), 1), 0) as avg_clarity_gain,
          COALESCE(SUM(secrets_scrubbed_count), 0) as total_secrets_guarded
         FROM prompt_insights`
      ).first(),
      env.DB.prepare(
        `SELECT domain, COUNT(*) as count
         FROM prompt_insights
         GROUP BY domain
         ORDER BY count DESC
         LIMIT 6`
      ).all(),
      env.DB.prepare(
        `SELECT domain, target_model, clarity_before, clarity_after, clarity_delta, user_action, created_at
         FROM prompt_insights
         ORDER BY created_at DESC
         LIMIT 8`
      ).all(),
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        summary: totals,
        domains: domains.results,
        recent: recent.results,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};
