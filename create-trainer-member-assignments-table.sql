-- Create trainer_member_assignments table for assigning trainers to members
CREATE TABLE trainer_member_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id UUID REFERENCES trainer_accounts(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  assigned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique active assignment per member (one trainer per member at a time)
  UNIQUE(member_id, is_active) DEFERRABLE INITIALLY DEFERRED
);

-- Enable RLS
ALTER TABLE trainer_member_assignments ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage all assignments (for admin operations)
CREATE POLICY "Service role can manage all assignments" ON trainer_member_assignments
  FOR ALL USING (auth.role() = 'service_role');

-- Allow trainers to view their own assignments
CREATE POLICY "Trainers can view their assignments" ON trainer_member_assignments
  FOR SELECT USING (
    trainer_id IN (
      SELECT id FROM trainer_accounts WHERE email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

-- Allow members to view their trainer assignment
CREATE POLICY "Members can view their trainer assignment" ON trainer_member_assignments
  FOR SELECT USING (
    member_id IN (
      SELECT id FROM members WHERE user_id = auth.uid()
    )
  );

-- Admin can view and manage all assignments
CREATE POLICY "Admin can manage all assignments" ON trainer_member_assignments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'icanbefitter@gmail.com'
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_trainer_member_assignments_trainer_id ON trainer_member_assignments(trainer_id);
CREATE INDEX idx_trainer_member_assignments_member_id ON trainer_member_assignments(member_id);
CREATE INDEX idx_trainer_member_assignments_active ON trainer_member_assignments(is_active);

-- Create trigger for updated_at
CREATE TRIGGER update_trainer_member_assignments_updated_at BEFORE UPDATE ON trainer_member_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle unique constraint for active assignments
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

-- Create trigger to ensure only one active assignment per member
CREATE TRIGGER ensure_unique_active_assignment
  BEFORE INSERT OR UPDATE ON trainer_member_assignments
  FOR EACH ROW
  EXECUTE FUNCTION check_unique_active_assignment();

-- Verify table creation
SELECT 'Trainer member assignments table created successfully!' as status;
