-- First, identify duplicate user_id entries
CREATE TEMP TABLE duplicate_memberships AS
SELECT user_id, COUNT(*), (array_agg(id ORDER BY created_at ASC))[1] as keep_id
FROM memberships
GROUP BY user_id
HAVING COUNT(*) > 1;

-- Delete duplicate entries, keeping only the oldest one for each user
DELETE FROM memberships
WHERE id IN (
  SELECT m.id 
  FROM memberships m
  JOIN duplicate_memberships d ON m.user_id = d.user_id
  WHERE m.id != d.keep_id
);

-- Now add the unique constraint
ALTER TABLE memberships DROP CONSTRAINT IF EXISTS memberships_user_id_key;
ALTER TABLE memberships ADD CONSTRAINT memberships_user_id_key UNIQUE (user_id);
