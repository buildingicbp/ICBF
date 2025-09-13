-- First, add a new column to store the hashed passwords temporarily
ALTER TABLE trainer_accounts ADD COLUMN temp_password TEXT;

-- Update the temporary column with hashed passwords
-- Use these bcrypt hashes for the corresponding passwords:
-- 'password123' -> $2a$10$8K1p/aCGqKq8W4Rq9d1ZzOcXJ5nYbGvXzJ8ZkYvXmWnLpQrXsYvW2
-- 'admin123' -> $2a$10$9K1q/BbGqKq9W5Rq9e1ZzOcXJ5nYbGvXzJ8ZkYvXmWnLpQrXsYvW3

UPDATE trainer_accounts 
SET temp_password = 
  CASE 
    WHEN email = 'trainer1@gym.com' THEN '$2a$10$8K1p/aCGqKq8W4Rq9d1ZzOcXJ5nYbGvXzJ8ZkYvXmWnLpQrXsYvW2'
    WHEN email = 'trainer2@gym.com' THEN '$2a$10$8K1p/aCGqKq8W4Rq9d1ZzOcXJ5nYbGvXzJ8ZkYvXmWnLpQrXsYvW2'
    WHEN email = 'admin@gym.com' THEN '$2a$10$9K1q/BbGqKq9W5Rq9e1ZzOcXJ5nYbGvXzJ8ZkYvXmWnLpQrXsYvW3'
  END
WHERE email IN ('trainer1@gym.com', 'trainer2@gym.com', 'admin@gym.com');

-- Verify the updates
SELECT id, email, temp_password FROM trainer_accounts;

-- Once verified, you can drop the old password column and rename the temp column
-- ALTER TABLE trainer_accounts DROP COLUMN password;
-- ALTER TABLE trainer_accounts RENAME COLUMN temp_password TO password;
