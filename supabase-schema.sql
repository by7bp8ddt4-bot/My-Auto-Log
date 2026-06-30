-- Analytics events table for product analytics
CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  properties JSONB NOT NULL DEFAULT '{}',
  url TEXT,
  path TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event ON analytics_events(event);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp DESC);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own events (or anonymously if no user_id)
CREATE POLICY "Anyone can insert analytics events"
  ON analytics_events FOR INSERT
  WITH CHECK (true);

-- Only allow users to view their own events (for debugging)
CREATE POLICY "Users can view their own analytics events"
  ON analytics_events FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Admins can view all events (via service role key)
CREATE POLICY "Service role can view all analytics events"
  ON analytics_events FOR SELECT
  USING (auth.role() = 'service_role');