-- Add missing columns to existing members table
ALTER TABLE members ADD COLUMN IF NOT EXISTS membership_type TEXT DEFAULT 'basic';
ALTER TABLE members ADD COLUMN IF NOT EXISTS total_workouts INTEGER DEFAULT 0;
ALTER TABLE members ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
ALTER TABLE members ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0;
ALTER TABLE members ADD COLUMN IF NOT EXISTS total_calories_burned INTEGER DEFAULT 0;
ALTER TABLE members ADD COLUMN IF NOT EXISTS experience_level TEXT DEFAULT 'beginner';
ALTER TABLE members ADD COLUMN IF NOT EXISTS fitness_goals TEXT[];
ALTER TABLE members ADD COLUMN IF NOT EXISTS medical_conditions TEXT[];
ALTER TABLE members ADD COLUMN IF NOT EXISTS emergency_contact TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS height DECIMAL(5,2);
ALTER TABLE members ADD COLUMN IF NOT EXISTS weight DECIMAL(5,2);
ALTER TABLE members ADD COLUMN IF NOT EXISTS last_workout TIMESTAMP WITH TIME ZONE;

-- Verify columns added
SELECT 'Missing columns added to members table successfully!' as status;
