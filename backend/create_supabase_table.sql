-- SQL script to create the app_users table in Supabase
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS app_users (
    id BIGSERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_app_users_username ON app_users(username);

-- Enable Row Level Security (optional, for additional security)
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

-- Drop the policy if it exists, then create it
-- (PostgreSQL doesn't support IF NOT EXISTS for CREATE POLICY)
DROP POLICY IF EXISTS "Service role can do everything" ON app_users;

CREATE POLICY "Service role can do everything" ON app_users
    FOR ALL
    USING (true)
    WITH CHECK (true);

