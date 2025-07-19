-- TEMPORARILY DISABLE RLS FOR TESTING
-- Run this in Supabase SQL Editor to test if RLS is the issue

-- Disable RLS on both tables
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
ALTER TABLE trainers DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename IN ('members', 'trainers');

-- Test insert (this should work now)
INSERT INTO members (user_id, username, email, contact, full_name, join_date, total_workouts, current_streak, longest_streak, total_calories_burned)
VALUES ('test-disable-rls', 'testuser', 'test@example.com', '+1234567890', 'Test User', NOW(), 0, 0, 0, 0)
ON CONFLICT (user_id) DO NOTHING;

-- Check if insert worked
SELECT * FROM members WHERE user_id = 'test-disable-rls';

-- Clean up test data
DELETE FROM members WHERE user_id = 'test-disable-rls';

SELECT 'RLS disabled successfully - try signing up a new user now' as status; 