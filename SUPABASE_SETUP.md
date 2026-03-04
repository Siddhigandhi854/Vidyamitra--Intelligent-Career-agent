# Supabase Database Setup Guide

## Step 1: Create the `app_users` Table

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Run the following SQL script:

```sql
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

-- Create a policy that allows service role to do everything
-- (This is needed for backend operations)
CREATE POLICY IF NOT EXISTS "Service role can do everything" ON app_users
    FOR ALL
    USING (true)
    WITH CHECK (true);
```

## Step 2: Verify Environment Variables

Make sure your backend has the Supabase credentials. Create a `.env` file in the `backend/` directory:

```env
SUPABASE_URL=https://ilmwebrpykhijzkxfimc.supabase.co
SUPABASE_KEY=your_service_role_key_here
JWT_SECRET=your_jwt_secret_here
```

**Important:** Use the **Service Role Key** (not the anon key) for `SUPABASE_KEY` in the backend.

## Step 3: Restart the Backend

After creating the table and setting up environment variables, restart your backend server:

```powershell
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

## Verification

Once set up, you should see in the backend logs:
- "User [email] created successfully in Supabase" when registering
- No fallback storage messages

Your users will now be stored in Supabase! 🎉

