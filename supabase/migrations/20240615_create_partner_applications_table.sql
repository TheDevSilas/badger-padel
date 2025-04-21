-- Create partner_applications table if it doesn't exist
CREATE TABLE IF NOT EXISTS partner_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT,
  phone TEXT,
  website TEXT,
  email TEXT NOT NULL,
  contactPerson TEXT NOT NULL,
  proposedDiscounts JSONB NOT NULL DEFAULT '[]'::jsonb,
  applicationDate TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row-level security
ALTER TABLE partner_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for partner_applications table
DROP POLICY IF EXISTS "Anyone can insert partner applications" ON partner_applications;
CREATE POLICY "Anyone can insert partner applications"
  ON partner_applications
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can do everything" ON partner_applications;
CREATE POLICY "Admins can do everything"
  ON partner_applications
  USING (true);

-- Enable realtime for partner_applications table
ALTER PUBLICATION supabase_realtime ADD TABLE partner_applications;
