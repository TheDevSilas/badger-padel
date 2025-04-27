-- Add imageUrl column to partners table
ALTER TABLE partners ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;