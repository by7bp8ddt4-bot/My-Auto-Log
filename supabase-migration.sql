-- ============================================
-- MTXtrkr Schema Migration
-- Adds missing columns to vehicles and maintenance_logs tables
-- Run this in Supabase SQL Editor if tables already exist
-- ============================================

-- Add missing columns to vehicles table
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS vin TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'car';
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS trim TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS engine_size TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS drivetrain TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS transmission TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS fuel_type TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS body_class TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS is_leased BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS lease_end_date DATE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS lease_mileage_limit INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS engine_serial TEXT;

-- Add missing columns to maintenance_logs table
ALTER TABLE maintenance_logs ADD COLUMN IF NOT EXISTS service_types JSONB DEFAULT '[]'::jsonb;
ALTER TABLE maintenance_logs ADD COLUMN IF NOT EXISTS raw_ocr_text TEXT;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_vehicles_type ON vehicles(type);
CREATE INDEX IF NOT EXISTS idx_vehicles_vin ON vehicles(vin);