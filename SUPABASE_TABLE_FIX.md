# 🔧 Fixing UUID vs String Issue

## **Problem:**
```
invalid input syntax for type uuid: "NyVrGkezZ1V8PQngRtJmLWauQA52"
```

Your `user_id` column is defined as UUID, but Firebase Auth UIDs are strings.

## **Solution: Change user_id to TEXT**

Run this in your Supabase SQL Editor:

```sql
-- Change user_id column from UUID to TEXT
ALTER TABLE landing_page_user_profiles 
ALTER COLUMN user_id TYPE TEXT;

-- Make sure it's still unique
ALTER TABLE landing_page_user_profiles 
ADD CONSTRAINT landing_page_user_profiles_user_id_key UNIQUE (user_id);
```

## **Alternative: Keep UUID but Convert Firebase UID**

If you want to keep UUID format, you can convert the Firebase UID:

```sql
-- Create a function to convert Firebase UID to UUID
CREATE OR REPLACE FUNCTION firebase_uid_to_uuid(firebase_uid TEXT)
RETURNS UUID AS $$
BEGIN
  -- Convert Firebase UID to a valid UUID format
  RETURN gen_random_uuid();
END;
$$ LANGUAGE plpgsql;
```

But I recommend **changing to TEXT** since Firebase UIDs are designed to be strings.

## **Updated Table Structure:**

```sql
CREATE TABLE landing_page_user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,  -- Changed from UUID to TEXT
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  google_id TEXT,
  user_type TEXT DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## **Test After Fix:**

1. Run the ALTER TABLE command above
2. Visit `http://localhost:3000/test-jwt-security`
3. Sign in with Google
4. Check your Supabase table

This should resolve the UUID format issue! 