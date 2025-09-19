-- Create trainer_actions table for daily actions/notes that trainers can add for their members

CREATE TABLE trainer_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id UUID NOT NULL,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  action_date DATE NOT NULL DEFAULT CURRENT_DATE,
  action_type TEXT CHECK (action_type IN ('workout_plan', 'diet_advice', 'progress_note', 'motivation', 'reminder', 'other')) DEFAULT 'other',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  is_visible_to_member BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add foreign key constraint for trainer_id (assuming trainer_accounts table exists)
  CONSTRAINT fk_trainer_actions_trainer FOREIGN KEY (trainer_id) REFERENCES trainer_accounts(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE trainer_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trainer_actions
-- Trainers can view their own actions
CREATE POLICY "Trainers can view own actions" ON trainer_actions
  FOR SELECT USING (
    trainer_id IN (
      SELECT id FROM trainer_accounts WHERE email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

-- Trainers can create actions for their assigned members
CREATE POLICY "Trainers can create actions for assigned members" ON trainer_actions
  FOR INSERT WITH CHECK (
    trainer_id IN (
      SELECT id FROM trainer_accounts WHERE email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
    AND member_id IN (
      SELECT member_id FROM trainer_member_assignments 
      WHERE trainer_id = trainer_actions.trainer_id AND is_active = true
    )
  );

-- Trainers can update their own actions
CREATE POLICY "Trainers can update own actions" ON trainer_actions
  FOR UPDATE USING (
    trainer_id IN (
      SELECT id FROM trainer_accounts WHERE email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

-- Trainers can delete their own actions
CREATE POLICY "Trainers can delete own actions" ON trainer_actions
  FOR DELETE USING (
    trainer_id IN (
      SELECT id FROM trainer_accounts WHERE email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

-- Members can view actions assigned to them (where is_visible_to_member = true)
CREATE POLICY "Members can view actions assigned to them" ON trainer_actions
  FOR SELECT USING (
    is_visible_to_member = true
    AND member_id IN (
      SELECT id FROM members WHERE user_id = auth.uid()
    )
  );

-- Admin can view all actions
CREATE POLICY "Admin can view all trainer actions" ON trainer_actions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'icanbefitter@gmail.com'
    )
  );

-- Service role can manage all actions
CREATE POLICY "Service role can manage all trainer actions" ON trainer_actions
  FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for better performance
CREATE INDEX idx_trainer_actions_trainer_id ON trainer_actions(trainer_id);
CREATE INDEX idx_trainer_actions_member_id ON trainer_actions(member_id);
CREATE INDEX idx_trainer_actions_date ON trainer_actions(action_date);
CREATE INDEX idx_trainer_actions_type ON trainer_actions(action_type);
CREATE INDEX idx_trainer_actions_visible ON trainer_actions(is_visible_to_member);

-- Create trigger for updated_at
CREATE TRIGGER update_trainer_actions_updated_at BEFORE UPDATE ON trainer_actions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
