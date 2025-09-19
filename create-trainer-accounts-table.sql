-- Create trainer_accounts table for simple email/password authentication
CREATE TABLE trainer_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL, -- Store hashed passwords in production
  full_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE trainer_accounts ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage trainer accounts
CREATE POLICY "Service role can manage trainer accounts" ON trainer_accounts
  FOR ALL USING (auth.role() = 'service_role');

-- Create index for performancei 
CREATE INDEX idx_trainer_accounts_email ON trainer_accounts(email);

-- Insert some sample trainer accounts (use bcrypt hashed passwords in production)
INSERT INTO trainer_accounts (email, password, full_name) VALUES
('trainer1@gym.com', 'password123', 'John Trainer'),
('trainer2@gym.com', 'password123', 'Sarah Fitness'),
('admin@gym.com', 'admin123', 'Admin Trainer');

-- Create trigger for updated_at
CREATE TRIGGER update_trainer_accounts_updated_at BEFORE UPDATE ON trainer_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
