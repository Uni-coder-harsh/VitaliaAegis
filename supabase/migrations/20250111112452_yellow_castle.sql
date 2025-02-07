/*
  # Create feedback table

  1. New Tables
    - `feedback`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `feedback` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `feedback` table
    - Add policy for anyone to insert feedback
    - Add policy for authenticated users to view feedback
*/

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  feedback text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can insert feedback"
  ON feedback
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view feedback"
  ON feedback
  FOR SELECT
  TO authenticated
  USING (true);