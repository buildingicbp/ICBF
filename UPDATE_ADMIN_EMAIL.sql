-- Update Admin Email in RLS Policies
-- Run this in Supabase SQL Editor to change admin email from gouravpanda2k04@gmail.com to icanbefitter@gmail.com

-- Drop existing admin policies
DROP POLICY IF EXISTS "Admin can view all members" ON members;
DROP POLICY IF EXISTS "Admin can manage all members" ON members;
DROP POLICY IF EXISTS "Admin can view all trainers" ON trainers;
DROP POLICY IF EXISTS "Admin can manage all trainers" ON trainers;

-- Create new admin policies with updated email
CREATE POLICY "Admin can view all members" ON members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'icanbefitter@gmail.com'
    )
  );

CREATE POLICY "Admin can manage all members" ON members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'icanbefitter@gmail.com'
    )
  );

CREATE POLICY "Admin can view all trainers" ON trainers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'icanbefitter@gmail.com'
    )
  );

CREATE POLICY "Admin can manage all trainers" ON trainers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'icanbefitter@gmail.com'
    )
  );

-- Verify the changes
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename IN ('members', 'trainers') 
AND policyname LIKE '%Admin%';

-- Test admin access (optional - run this after creating admin user)
-- SELECT 'Admin policies updated successfully' as status; 