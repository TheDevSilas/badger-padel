-- Fix RLS policies for memberships table

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own membership" ON public.memberships;
DROP POLICY IF EXISTS "Users can update their own membership" ON public.memberships;
DROP POLICY IF EXISTS "Users can insert their own membership" ON public.memberships;

-- Create policies with proper permissions
CREATE POLICY "Users can view their own membership"
  ON public.memberships FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own membership"
  ON public.memberships FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own membership"
  ON public.memberships FOR INSERT
  WITH CHECK (auth.uid() = user_id);
