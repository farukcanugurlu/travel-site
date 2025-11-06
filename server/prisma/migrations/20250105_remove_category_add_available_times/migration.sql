-- AlterTable
ALTER TABLE "tours" DROP COLUMN IF EXISTS "category";

-- AlterTable
ALTER TABLE "tours" ADD COLUMN IF NOT EXISTS "availableTimes" JSONB;

