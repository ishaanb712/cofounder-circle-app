# 🔧 Complete Fix for Table Structure

## **Your Current Table:**
- Has foreign key to `auth.users(id)`
- Has RLS policies that depend on `user_id`
- `user_id` is UUID but Firebase UIDs are strings

## **Solution: Remove Foreign Key + Change Column Type**

### **Step 1: Drop RLS Policies**
```sql
-- Drop all RLS policies first
DROP POLICY IF EXISTS "Users can insert their own profile" ON landing_page_user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON landing_page_user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON landing_page_user_profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON landing_page_user_profiles;
```

### **Step 2: Drop Foreign Key Constraint**
```sql
-- Drop the foreign key constraint
ALTER TABLE landing_page_user_profiles 
DROP CONSTRAINT IF EXISTS landing_page_user_profiles_user_id_fkey;
```

### **Step 3: Change Column Type**
```sql
-- Change user_id from UUID to TEXT
ALTER TABLE landing_page_user_profiles 
ALTER COLUMN user_id TYPE TEXT;
```

### **Step 4: Add Unique Constraint**
```sql
-- Add unique constraint on user_id
ALTER TABLE landing_page_user_profiles 
ADD CONSTRAINT landing_page_user_profiles_user_id_key UNIQUE (user_id);
```

### **Step 5: Recreate RLS Policies (Optional)**
```sql
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
```

## **Updated Table Structure:**
```sql
CREATE TABLE landing_page_user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,  -- Changed from UUID to TEXT
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  user_type TEXT DEFAULT 'student',
  google_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT landing_page_user_profiles_user_type_check CHECK (
    user_type = ANY (ARRAY['student', 'founder', 'mentor', 'vendor', 'professional'])
  )
);
```

## **Why Remove Foreign Key:**
- ❌ **auth.users** is for Supabase Auth users
- ✅ **Firebase Auth** uses different user IDs
- ✅ **No foreign key needed** since we're using Firebase Auth

## **Test After Fix:**
1. Run all the SQL commands above in order
2. Visit `http://localhost:3000/test-jwt-security`
3. Sign in with Google
4. Check your Supabase table

This should resolve all the issues! 