-- Add contactPerson column to partners table
ALTER TABLE partners ADD COLUMN IF NOT EXISTS contactperson TEXT;
