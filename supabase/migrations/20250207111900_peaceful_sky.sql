/*
  # Add Medical Fields to Profiles Table

  1. New Columns
    - medical_details_completed (boolean)
    - allergies (text[])
    - chronic_conditions (text[])
    - medications (text)
    - exercise_frequency (text)
    - sleep_hours (integer)
    - stress_level (integer)
    - diet_type (text)

  2. Changes
    - Add new columns to profiles table
    - Add validation constraints
    - Update RLS policies
*/

-- Add new columns to profiles table
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS medical_details_completed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS allergies text[],
  ADD COLUMN IF NOT EXISTS chronic_conditions text[],
  ADD COLUMN IF NOT EXISTS medications text,
  ADD COLUMN IF NOT EXISTS exercise_frequency text,
  ADD COLUMN IF NOT EXISTS sleep_hours integer,
  ADD COLUMN IF NOT EXISTS stress_level integer,
  ADD COLUMN IF NOT EXISTS diet_type text;

-- Add constraints
ALTER TABLE profiles
  ADD CONSTRAINT sleep_hours_check CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
  ADD CONSTRAINT stress_level_check CHECK (stress_level >= 1 AND stress_level <= 10);

-- Update RLS policies to ensure they cover new fields
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);