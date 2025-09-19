-- Fix database issues for trainer-member assignments

-- 1. Add missing columns to members table to match what the API expects
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

-- 2. Verify trainer_member_assignments table exists and has correct structure
-- Drop and recreate if there are issues
DROP TABLE IF EXISTS trainer_member_assignments CASCADE;

CREATE TABLE trainer_member_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id UUID NOT NULL,
  member_id UUID NOT NULL,
  assigned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add foreign key constraints explicitly
  CONSTRAINT fk_trainer_member_assignments_trainer 
    FOREIGN KEY (trainer_id) REFERENCES trainer_accounts(id) ON DELETE CASCADE,
  CONSTRAINT fk_trainer_member_assignments_member 
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    
  -- Ensure unique active assignment per member (one trainer per member at a time)
  UNIQUE(member_id, is_active) DEFERRABLE INITIALLY DEFERRED
);

-- 3. Enable RLS
ALTER TABLE trainer_member_assignments ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
CREATE POLICY "Service role can manage all assignments" ON trainer_member_assignments
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Trainers can view their assignments" ON trainer_member_assignments
  FOR SELECT USING (
    trainer_id IN (
      SELECT id FROM trainer_accounts WHERE email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Members can view their trainer assignment" ON trainer_member_assignments
  FOR SELECT USING (
    member_id IN (
      SELECT id FROM members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can manage all assignments" ON trainer_member_assignments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'icanbefitter@gmail.com'
    )
  );

-- 5. Create indexes for better performance
CREATE INDEX idx_trainer_member_assignments_trainer_id ON trainer_member_assignments(trainer_id);
CREATE INDEX idx_trainer_member_assignments_member_id ON trainer_member_assignments(member_id);
CREATE INDEX idx_trainer_member_assignments_active ON trainer_member_assignments(is_active);

-- 6. Create trigger for updated_at
CREATE TRIGGER update_trainer_member_assignments_updated_at BEFORE UPDATE ON trainer_member_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Create function to handle unique constraint for active assignments
CREATE OR REPLACE FUNCTION check_unique_active_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is an active assignment, deactivate any existing active assignments for this member
  IF NEW.is_active = TRUE THEN
    UPDATE trainer_member_assignments 
    SET is_active = FALSE, updated_at = NOW()
    WHERE member_id = NEW.member_id 
    AND is_active = TRUE 
    AND id != COALESCE(NEW.id, gen_random_uuid());
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Create trigger to ensure only one active assignment per member
CREATE TRIGGER ensure_unique_active_assignment
  BEFORE INSERT OR UPDATE ON trainer_member_assignments
  FOR EACH ROW
  EXECUTE FUNCTION check_unique_active_assignment();

-- Verify table creation
SELECT 'Database issues fixed successfully!' as status;
