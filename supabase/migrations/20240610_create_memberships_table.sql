-- Create memberships table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  membership_number TEXT NOT NULL,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own membership" ON public.memberships;
CREATE POLICY "Users can view their own membership"
  ON public.memberships FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own membership" ON public.memberships;
CREATE POLICY "Users can update their own membership"
  ON public.memberships FOR UPDATE
  USING (auth.uid() = user_id);

-- Add to realtime publication if not already added
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'memberships'
  ) THEN
    alter publication supabase_realtime add table memberships;
  END IF;
END
$$;