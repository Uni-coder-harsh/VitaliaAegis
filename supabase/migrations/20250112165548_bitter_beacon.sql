/*
  # Fix storage and medical records

  1. Storage Buckets
    - Create avatars bucket for profile photos
    - Create medical_records bucket for medical documents
    - Set up appropriate security policies

  2. Changes
    - Add storage bucket configurations
    - Update RLS policies for better security
*/

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name)
VALUES ('avatars', 'avatars')
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name)
VALUES ('medical_records', 'medical_records')
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Set up storage policies for medical records
CREATE POLICY "Users can access their own medical records"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'medical_records' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload their own medical records"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'medical_records' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_medical_records_user_id ON medical_records(user_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_uploaded_at ON medical_records(uploaded_at DESC);