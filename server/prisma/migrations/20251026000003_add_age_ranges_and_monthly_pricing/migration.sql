-- AlterTable
ALTER TABLE "tour_packages" ADD COLUMN IF NOT EXISTS "childMaxAge" INTEGER;

-- AlterTable
ALTER TABLE "tour_packages" ADD COLUMN IF NOT EXISTS "infantMaxAge" INTEGER;

-- AlterTable
ALTER TABLE "tour_packages" ADD COLUMN IF NOT EXISTS "monthlyPrices" JSONB;

