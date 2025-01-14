/*
  # Fix Profile Table Policies

  1. Changes
    - Add INSERT policy for authenticated users
    - Update existing policies for better security

  2. Security
    - Enable RLS (already enabled)
    - Add policy for authenticated users to insert their own profile
    - Ensure users can only manage their own profile data
*/

-- Add INSERT policy for profiles
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Update existing policies to be more specific
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);