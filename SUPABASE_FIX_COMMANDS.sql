-- 🔧 Complete Fix for Supabase Table Structure
-- Run these commands in your Supabase SQL Editor

-- Step 1: Drop RLS Policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON landing_page_user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON landing_page_user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON landing_page_user_profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON landing_page_user_profiles;

-- Step 2: Drop Foreign Key Constraint
ALTER TABLE landing_page_user_profiles 
DROP CONSTRAINT IF EXISTS landing_page_user_profiles_user_id_fkey;

-- Step 3: Change Column Type from UUID to TEXT
ALTER TABLE landing_page_user_profiles 
ALTER COLUMN user_id TYPE TEXT;

-- Step 4: Add Unique Constraint
ALTER TABLE landing_page_user_profiles 
ADD CONSTRAINT landing_page_user_profiles_user_id_key UNIQUE (user_id);

-- Step 5: Temporarily Disable RLS for Testing
ALTER TABLE landing_page_user_profiles DISABLE ROW LEVEL SECURITY;

-- Optional: Recreate RLS Policies (uncomment when ready for production)
/*
-- Enable RLS
ALTER TABLE landing_page_user_profiles ENABLE ROW LEVEL SECURITY;

-- Create new policies for TEXT user_id
CREATE POLICY "Users can insert their own profile" ON landing_page_user_profiles
FOR INSERT WITH CHECK (public.firebase_uid() = user_id);

CREATE POLICY "Users can view their own profile" ON landing_page_user_profiles
FOR SELECT USING (public.firebase_uid() = user_id);

CREATE POLICY "Users can update their own profile" ON landing_page_user_profiles
FOR UPDATE USING (public.firebase_uid() = user_id);

CREATE POLICY "Users can delete their own profile" ON landing_page_user_profiles
FOR DELETE USING (public.firebase_uid() = user_id);
*/ 