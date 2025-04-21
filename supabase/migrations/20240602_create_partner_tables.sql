-- Create partner_applications table if it doesn't exist
CREATE TABLE IF NOT EXISTS partner_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT,
  phone TEXT,
  website TEXT,
  proposed_discounts JSONB NOT NULL DEFAULT '[]'::JSONB,
  email TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  application_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending',
  message TEXT
);

-- Create partners table if it doesn't exist
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT,
  phone TEXT,
  website TEXT,
  discounts JSONB NOT NULL DEFAULT '[]'::JSONB,
  image TEXT,
  status TEXT NOT NULL,
  email TEXT,
  contact_person TEXT,
  application_date TIMESTAMP WITH TIME ZONE,
  approval_date TIMESTAMP WITH TIME ZONE,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create admins table if it doesn't exist
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE partner_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policies for partner_applications
DROP POLICY IF EXISTS "Admins can do all operations on partner_applications" ON partner_applications;
CREATE POLICY "Admins can do all operations on partner_applications"
  ON partner_applications
  USING (auth.uid() IN (SELECT id FROM admins));

-- Create policies for partners
DROP POLICY IF EXISTS "Admins can do all operations on partners" ON partners;
CREATE POLICY "Admins can do all operations on partners"
  ON partners
  USING (auth.uid() IN (SELECT id FROM admins));

DROP POLICY IF EXISTS "Everyone can view active partners" ON partners;
CREATE POLICY "Everyone can view active partners"
  ON partners
  FOR SELECT
  USING (active = TRUE);

-- Create policies for admins table
DROP POLICY IF EXISTS "Admins can manage admins" ON admins;
CREATE POLICY "Admins can manage admins"
  ON admins
  USING (auth.uid() IN (SELECT id FROM admins));

-- Insert initial admin (using the email from AdminDashboard.tsx)
INSERT INTO admins (id, email)
SELECT id, email FROM auth.users WHERE email = 'admin@example.com'
ON CONFLICT (id) DO NOTHING;

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE partner_applications;
ALTER PUBLICATION supabase_realtime ADD TABLE partners;
ALTER PUBLICATION supabase_realtime ADD TABLE admins;