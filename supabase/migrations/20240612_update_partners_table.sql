-- Ensure the partners table exists with all required fields
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT,
  phone TEXT,
  website TEXT,
  discounts JSONB NOT NULL DEFAULT '[]'::jsonb,
  image TEXT,
  status TEXT NOT NULL,
  email TEXT,
  contactPerson TEXT,
  applicationDate TIMESTAMP WITH TIME ZONE,
  approvalDate TIMESTAMP WITH TIME ZONE,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row-level security
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Create policies for partners table
DROP POLICY IF EXISTS "Admins can do everything" ON partners;
CREATE POLICY "Admins can do everything"
  ON partners
  USING (true);

-- Enable realtime for partners table
ALTER PUBLICATION supabase_realtime ADD TABLE partners;
