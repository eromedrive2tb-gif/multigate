-- Add api_token column to users table
ALTER TABLE users ADD COLUMN api_token TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_api_token ON users(api_token);
 Sands

-- Generate initial tokens for existing users (optional but good for backwards compatibility)
-- Since this is a demo/development environment, we'll let the app handle generation on first access or login
