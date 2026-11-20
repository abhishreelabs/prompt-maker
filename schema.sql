-- Prompt Maker D1 Schema: Zero-PII Telemetry & Learning Insights
-- Cloudflare D1 Serverless SQLite

CREATE TABLE IF NOT EXISTS prompt_insights (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  domain TEXT NOT NULL,
  target_framework TEXT DEFAULT 'crispe',
  target_model TEXT DEFAULT 'general',
  clarity_before INTEGER NOT NULL,
  clarity_after INTEGER NOT NULL,
  clarity_delta INTEGER GENERATED ALWAYS AS (clarity_after - clarity_before) STORED,
  defects_detected TEXT DEFAULT '[]', -- JSON string of defect IDs
  invariants_injected TEXT DEFAULT '[]', -- JSON string of invariant rules added
  secrets_scrubbed_count INTEGER DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  user_action TEXT DEFAULT 'compile', -- compile, copy, feedback_positive, feedback_negative
  generation_mode TEXT DEFAULT 'offline_heuristic' -- offline_heuristic, ai_gemini, ai_openai
);

CREATE INDEX IF NOT EXISTS idx_insights_created_at ON prompt_insights(created_at);
CREATE INDEX IF NOT EXISTS idx_insights_domain ON prompt_insights(domain);
CREATE INDEX IF NOT EXISTS idx_insights_user_action ON prompt_insights(user_action);

-- Curated Production Prompt Blueprints
CREATE TABLE IF NOT EXISTS prompt_blueprints (
  id TEXT PRIMARY KEY,
  project TEXT NOT NULL,
  category TEXT NOT NULL,
  raw_user_prompt TEXT NOT NULL,
  context TEXT NOT NULL,
  target_stack TEXT NOT NULL,
  why_it_failed_before TEXT,
  key_upgrades TEXT DEFAULT '[]', -- JSON string of upgrade rules
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_blueprints_category ON prompt_blueprints(category);
CREATE INDEX IF NOT EXISTS idx_blueprints_project ON prompt_blueprints(project);
