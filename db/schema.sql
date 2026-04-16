-- BLOOMBR — Neon (serverless Postgres) schema
-- Run this once in the Neon SQL editor after creating your project
-- Free tier: 0.5 GB storage, never pauses (unlike Supabase)

-- Pricing snapshots — one row per model per day
CREATE TABLE IF NOT EXISTS pricing_history (
  id           BIGSERIAL PRIMARY KEY,
  model_id     TEXT           NOT NULL,       -- matches Model.id in models.ts
  input_price  NUMERIC(10, 4) NOT NULL,       -- $ per 1M input tokens
  output_price NUMERIC(10, 4) NOT NULL,       -- $ per 1M output tokens
  recorded_date DATE          NOT NULL DEFAULT CURRENT_DATE,
  recorded_at  TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- One row per model per day (index on a plain column — no function needed)
CREATE UNIQUE INDEX IF NOT EXISTS pricing_history_model_day
  ON pricing_history (model_id, recorded_date);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS pricing_history_model_id    ON pricing_history (model_id);
CREATE INDEX IF NOT EXISTS pricing_history_recorded_at ON pricing_history (recorded_at DESC);

-- View: latest price per model
CREATE OR REPLACE VIEW latest_prices AS
SELECT DISTINCT ON (model_id)
  model_id, input_price, output_price, recorded_at
FROM pricing_history
ORDER BY model_id, recorded_at DESC;

-- View: price changes (rows where price differs from previous snapshot)
CREATE OR REPLACE VIEW price_changes AS
SELECT
  model_id,
  input_price,
  output_price,
  recorded_at,
  LAG(input_price)  OVER (PARTITION BY model_id ORDER BY recorded_at) AS prev_input,
  LAG(output_price) OVER (PARTITION BY model_id ORDER BY recorded_at) AS prev_output
FROM pricing_history;
