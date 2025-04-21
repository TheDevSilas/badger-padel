-- Add unique constraint to membership_number if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'memberships_membership_number_key' AND conrelid = 'memberships'::regclass
  ) THEN
    ALTER TABLE memberships ADD CONSTRAINT memberships_membership_number_key UNIQUE (membership_number);
  END IF;

  -- Ensure user_id has a unique constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'memberships_user_id_key' AND conrelid = 'memberships'::regclass
  ) THEN
    ALTER TABLE memberships ADD CONSTRAINT memberships_user_id_key UNIQUE (user_id);
  END IF;
END $$;
