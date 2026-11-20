interface Env {
  DB: D1Database;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

interface RawBlueprintRow {
  id: string;
  project: string;
  category: string;
  raw_user_prompt: string;
  context: string;
  target_stack: string;
  why_it_failed_before: string;
  key_upgrades: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;

    if (!env.DB) {
      return new Response(
        JSON.stringify({ success: false, error: 'Database binding DB not found' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const project = url.searchParams.get('project');

    let query = `SELECT id, project, category, raw_user_prompt, context, target_stack, why_it_failed_before, key_upgrades FROM prompt_blueprints`;
    const params: string[] = [];

    if (category) {
      query += ` WHERE category = ?`;
      params.push(category);
    } else if (project) {
      query += ` WHERE project LIKE ?`;
      params.push(`%${project}%`);
    }

    query += ` ORDER BY category, project`;

    const statement = params.length > 0 ? env.DB.prepare(query).bind(...params) : env.DB.prepare(query);
    const { results } = await statement.all<RawBlueprintRow>();

    const blueprints = (results || []).map((row) => {
      let upgrades: string[] = [];
      try {
        upgrades = JSON.parse(row.key_upgrades);
      } catch {
        upgrades = [];
      }

      return {
        id: row.id,
        project: row.project,
        category: row.category,
        rawUserPrompt: row.raw_user_prompt,
        context: row.context,
        targetStack: row.target_stack,
        whyItFailedBefore: row.why_it_failed_before,
        keyUpgrades: upgrades,
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        count: blueprints.length,
        blueprints,
        source: 'cloudflare-d1-edge',
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60, s-maxage=300',
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
