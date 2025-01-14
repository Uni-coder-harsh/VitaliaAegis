/*
  # Add Profile Fields and Medical Records

  1. Changes
    - Add enrollment number, profile photo URL, and other profile fields
    - Create medical_records table for prescriptions and records
    - Set up appropriate RLS policies

  2. Security
    - Enable RLS on medical_records
    - Add policies for authenticated users
*/

-- Add new columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS enrollment_number text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS blood_group text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age integer;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS weight numeric;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS height numeric;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS course text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;

-- Create medical_records table
CREATE TABLE IF NOT EXISTS medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  description text,
  record_date date
);

-- Enable RLS
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- Create policies for medical_records
CREATE POLICY "Users can manage own medical records"
  ON medical_records
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);