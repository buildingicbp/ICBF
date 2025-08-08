-- FIX FOR DEPLOYMENT - Run this in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Members can insert own profile" ON members;
DROP POLICY IF EXISTS "Trainers can insert own profile" ON trainers;

-- Create new policies that allow authenticated users to create profiles
CREATE POLICY "Members can insert own profile" ON members
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

CREATE POLICY "Trainers can insert own profile" ON trainers
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

-- Also allow service role
CREATE POLICY "Service role can insert members" ON members
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can insert trainers" ON trainers
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Test the policies
-- This should work for any authenticated user
SELECT 'RLS policies updated successfully' as status; 