-- Migration: Add age ranges and monthly pricing to tour_packages table
-- Run this SQL script on your database

-- Add childMaxAge column
ALTER TABLE "tour_packages" 
ADD COLUMN IF NOT EXISTS "childMaxAge" INTEGER;

-- Add infantMaxAge column
ALTER TABLE "tour_packages" 
ADD COLUMN IF NOT EXISTS "infantMaxAge" INTEGER;

-- Add monthlyPrices JSON column
ALTER TABLE "tour_packages" 
ADD COLUMN IF NOT EXISTS "monthlyPrices" JSONB;

-- Add comments for documentation
COMMENT ON COLUMN "tour_packages"."childMaxAge" IS 'Maximum age for child ticket (e.g., 5 or 6)';
COMMENT ON COLUMN "tour_packages"."infantMaxAge" IS 'Maximum age for infant ticket (e.g., 2 or 3)';
COMMENT ON COLUMN "tour_packages"."monthlyPrices" IS 'Monthly prices override base prices. Format: {"1": {"adultPrice": 150, "childPrice": 75, "infantPrice": 0}, ...}';

