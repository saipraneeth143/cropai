-- ============================================================
-- CropAI Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension (usually enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Farms Table
CREATE TABLE farms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_name TEXT NOT NULL,
    location_region TEXT NOT NULL,
    farm_size_acres NUMERIC NOT NULL,
    soil_type TEXT NOT NULL,
    soil_ph NUMERIC NOT NULL,
    climate_zone TEXT NOT NULL,
    water_source TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Advisories Table
CREATE TABLE advisories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    advisory_data JSONB NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisories ENABLE ROW LEVEL SECURITY;

-- Farm Policies
CREATE POLICY "Users can view own farms" ON farms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own farms" ON farms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own farms" ON farms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own farms" ON farms FOR DELETE USING (auth.uid() = user_id);

-- Advisory Policies
CREATE POLICY "Users can view own advisories" ON advisories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own advisories" ON advisories FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Indexes for Performance
-- ============================================================

CREATE INDEX idx_farms_user_id ON farms(user_id);
CREATE INDEX idx_advisories_farm_id ON advisories(farm_id);
CREATE INDEX idx_advisories_user_id ON advisories(user_id);
CREATE INDEX idx_advisories_generated_at ON advisories(generated_at DESC);
