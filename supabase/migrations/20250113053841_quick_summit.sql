/*
  # Add Mental Health Assessment Feature

  1. New Tables
    - `mental_health_assessments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `email` (text)
      - `score` (integer)
      - `result` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `mental_health_assessments` table
    - Add policies for authenticated users
*/

-- Create mental health assessments table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS mental_health_assessments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text NOT NULL,
    score integer NOT NULL,
    result text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Enable RLS if not already enabled
DO $$ BEGIN
  ALTER TABLE mental_health_assessments ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;

-- Drop existing policy if it exists and create new one
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can manage their own assessments" ON mental_health_assessments;
  
  CREATE POLICY "Users can manage their own assessments"
    ON mental_health_assessments
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create index if it doesn't exist
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_mental_health_assessments_user_id 
    ON mental_health_assessments(user_id);
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;

-- Add trigger for updated_at if it doesn't exist
DO $$ BEGIN
  CREATE TRIGGER update_mental_health_assessments_updated_at
    BEFORE UPDATE ON mental_health_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;