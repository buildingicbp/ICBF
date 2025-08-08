-- Create simple members table for ICBF
-- Run this query in your Supabase SQL Editor

CREATE TABLE members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  contact TEXT,
  full_name TEXT,
  join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Create policies for members table
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON members
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON members
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to create profiles (for new signups)
CREATE POLICY "Authenticated users can create profiles" ON members
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Service role can manage all profiles (for admin operations)
CREATE POLICY "Service role can manage all profiles" ON members
  FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for better performance
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_username ON members(username);

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_members_updated_at 
    BEFORE UPDATE ON members 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verify table creation
SELECT 'Members table created successfully!' as status; 