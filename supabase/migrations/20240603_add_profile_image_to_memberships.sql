-- Add profile_image_url column to memberships table
ALTER TABLE memberships ADD COLUMN IF NOT EXISTS profile_image_url TEXT;