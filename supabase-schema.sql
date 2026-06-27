-- MyAutoLog Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- VEHICLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL DEFAULT 2024,
  license_plate TEXT,
  mileage INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- MAINTENANCE LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS maintenance_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  description TEXT,
  mileage INTEGER NOT NULL DEFAULT 0,
  cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  documents JSONB DEFAULT '[]'::jsonb,
  source TEXT DEFAULT 'manual',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- REMINDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  interval_miles INTEGER NOT NULL DEFAULT 5000,
  interval_days INTEGER NOT NULL DEFAULT 180,
  due_mileage INTEGER NOT NULL DEFAULT 0,
  due_date TIMESTAMPTZ,
  enabled BOOLEAN NOT NULL DEFAULT true,
  last_completed_mileage INTEGER NOT NULL DEFAULT 0,
  last_completed_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_user_id ON maintenance_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_vehicle_id ON maintenance_logs(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_vehicle_id ON reminders(vehicle_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Vehicles policies
CREATE POLICY "Users can view their own vehicles"
  ON vehicles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vehicles"
  ON vehicles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vehicles"
  ON vehicles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vehicles"
  ON vehicles FOR DELETE
  USING (auth.uid() = user_id);

-- Maintenance logs policies
CREATE POLICY "Users can view their own maintenance logs"
  ON maintenance_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own maintenance logs"
  ON maintenance_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own maintenance logs"
  ON maintenance_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own maintenance logs"
  ON maintenance_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Reminders policies
CREATE POLICY "Users can view their own reminders"
  ON reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminders"
  ON reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders"
  ON reminders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders"
  ON reminders FOR DELETE
  USING (auth.uid() = user_id);