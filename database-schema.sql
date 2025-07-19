-- ICBF Database Schema
-- Create tables for members and trainers

-- Members table
CREATE TABLE members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  contact TEXT,
  full_name TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  height DECIMAL(5,2), -- in cm
  weight DECIMAL(5,2), -- in kg
  fitness_goals TEXT[], -- array of goals
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  medical_conditions TEXT[], -- array of conditions
  emergency_contact TEXT,
  membership_type TEXT CHECK (membership_type IN ('basic', 'premium', 'vip')) DEFAULT 'basic',
  join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_workout TIMESTAMP WITH TIME ZONE,
  total_workouts INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_calories_burned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trainers table
CREATE TABLE trainers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  contact TEXT,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  specialization TEXT[], -- array of specializations
  certifications TEXT[], -- array of certifications
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  hourly_rate DECIMAL(8,2) DEFAULT 50.00,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  total_clients INTEGER DEFAULT 0,
  active_clients INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  working_hours TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table (for tracking trainer sessions)
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id UUID REFERENCES trainers(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER,
  status TEXT CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')) DEFAULT 'scheduled',
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workouts table (for tracking member workouts)
CREATE TABLE workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  workout_type TEXT NOT NULL,
  workout_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_minutes INTEGER,
  calories_burned INTEGER,
  exercises JSONB, -- store exercise details as JSON
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goals table (for tracking member fitness goals)
CREATE TABLE goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL,
  target_value DECIMAL(10,2),
  current_value DECIMAL(10,2) DEFAULT 0,
  unit TEXT,
  target_date DATE,
  status TEXT CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Members
CREATE POLICY "Members can view own profile" ON members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Members can update own profile" ON members
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Members can insert own profile" ON members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow service role to manage all member profiles (for profile creation)
CREATE POLICY "Service role can manage all member profiles" ON members
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for Trainers
CREATE POLICY "Trainers can view own profile" ON trainers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Trainers can update own profile" ON trainers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Trainers can insert own profile" ON trainers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow service role to manage all trainer profiles (for profile creation)
CREATE POLICY "Service role can manage all trainer profiles" ON trainers
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for Sessions
CREATE POLICY "Users can view sessions they're involved in" ON sessions
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM trainers WHERE id = trainer_id
      UNION
      SELECT user_id FROM members WHERE id = member_id
    )
  );

CREATE POLICY "Trainers can create sessions" ON sessions
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT user_id FROM trainers WHERE id = trainer_id)
  );

CREATE POLICY "Trainers can update their sessions" ON sessions
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM trainers WHERE id = trainer_id)
  );

-- RLS Policies for Workouts
CREATE POLICY "Members can view own workouts" ON workouts
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM members WHERE id = member_id)
  );

CREATE POLICY "Members can create own workouts" ON workouts
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT user_id FROM members WHERE id = member_id)
  );

CREATE POLICY "Members can update own workouts" ON workouts
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM members WHERE id = member_id)
  );

-- RLS Policies for Goals
CREATE POLICY "Members can view own goals" ON goals
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM members WHERE id = member_id)
  );

CREATE POLICY "Members can create own goals" ON goals
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT user_id FROM members WHERE id = member_id)
  );

CREATE POLICY "Members can update own goals" ON goals
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM members WHERE id = member_id)
  );

-- Admin policies for specific email
CREATE POLICY "Admin can view all members" ON members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'gouravpanda2k04@gmail.com'
    )
  );

CREATE POLICY "Admin can manage all members" ON members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'gouravpanda2k04@gmail.com'
    )
  );

CREATE POLICY "Admin can view all trainers" ON trainers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'gouravpanda2k04@gmail.com'
    )
  );

CREATE POLICY "Admin can manage all trainers" ON trainers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'gouravpanda2k04@gmail.com'
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_username ON members(username);

CREATE INDEX idx_trainers_user_id ON trainers(user_id);
CREATE INDEX idx_trainers_email ON trainers(email);
CREATE INDEX idx_trainers_username ON trainers(username);

CREATE INDEX idx_sessions_trainer_id ON sessions(trainer_id);
CREATE INDEX idx_sessions_member_id ON sessions(member_id);
CREATE INDEX idx_sessions_date ON sessions(session_date);

CREATE INDEX idx_workouts_member_id ON workouts(member_id);
CREATE INDEX idx_workouts_date ON workouts(workout_date);

CREATE INDEX idx_goals_member_id ON goals(member_id);
CREATE INDEX idx_goals_status ON goals(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trainers_updated_at BEFORE UPDATE ON trainers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 