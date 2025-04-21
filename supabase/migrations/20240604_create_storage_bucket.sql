-- Create a storage bucket for membership profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('membership-images', 'membership-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies to allow authenticated users to upload their own images
CREATE POLICY "Users can upload their own profile images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'membership-images');

CREATE POLICY "Profile images are publicly accessible"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'membership-images');

CREATE POLICY "Users can update their own profile images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'membership-images');

CREATE POLICY "Users can delete their own profile images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'membership-images');