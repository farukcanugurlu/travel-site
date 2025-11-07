-- Settings tablosunu oluştur
CREATE TABLE IF NOT EXISTS "settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- İlk default veriyi ekle (boş JSON)
INSERT INTO "settings" ("id", "data", "updatedAt") 
VALUES ('singleton', '{}', NOW())
ON CONFLICT ("id") DO NOTHING;

