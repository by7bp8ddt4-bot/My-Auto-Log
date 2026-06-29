-- Fuel economy tracking table
CREATE TABLE IF NOT EXISTS fuel_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  mileage INTEGER NOT NULL DEFAULT 0,
  gallons DECIMAL(6,2) NOT NULL DEFAULT 0,
  cost DECIMAL(8,2) NOT NULL DEFAULT 0,
  is_full_tank BOOLEAN NOT NULL DEFAULT true,
  octane TEXT DEFAULT 'regular',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fuel_logs_user_id ON fuel_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_fuel_logs_vehicle_id ON fuel_logs(vehicle_id);

ALTER TABLE fuel_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own fuel logs"
  ON fuel_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own fuel logs"
  ON fuel_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own fuel logs"
  ON fuel_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own fuel logs"
  ON fuel_logs FOR DELETE USING (auth.uid() = user_id);