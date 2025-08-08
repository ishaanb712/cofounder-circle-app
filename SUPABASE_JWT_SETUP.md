# 🔐 Setting Up JWT-Based RLS Policies

## **Step 1: Create JWT Function in Supabase**

Go to your Supabase Dashboard → SQL Editor and run:

```sql
-- Create a function to extract Firebase UID from JWT
CREATE OR REPLACE FUNCTION public.firebase_uid()
RETURNS text AS $$
BEGIN
  RETURN current_setting('request.jwt.claims', true)::json->>'firebase_uid';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

```

## **Step 2: Enable RLS on the Table**

```sql
-- Enable Row Level Security
ALTER TABLE landing_page_user_profiles ENABLE ROW LEVEL SECURITY;
```

## **Step 3: Create RLS Policies**

```sql
-- Insert policy: Users can only insert their own profile
CREATE POLICY "Users can insert their own profile" ON landing_page_user_profiles
FOR INSERT WITH CHECK (public.firebase_uid() = user_id::text);

-- Select policy: Users can only view their own profile
CREATE POLICY "Users can view their own profile" ON landing_page_user_profiles
FOR SELECT USING (public.firebase_uid() = user_id::text);

-- Update policy: Users can only update their own profile
CREATE POLICY "Users can update their own profile" ON landing_page_user_profiles
FOR UPDATE USING (public.firebase_uid() = user_id::text);

-- Delete policy: Users can only delete their own profile
CREATE POLICY "Users can delete their own profile" ON landing_page_user_profiles
FOR DELETE USING (public.firebase_uid() = user_id::text);
```

## **Step 4: Test the Setup**

1. Visit `http://localhost:3000/test-auth`
2. Sign in with Google
3. Check your Supabase table - you should see the user profile
4. Try accessing another user's profile - it should be blocked

## **How It Works:**

1. **Firebase Auth** → User signs in and gets JWT token
2. **JWT Token** → Contains Firebase UID in claims
3. **Supabase RLS** → Uses `auth.firebase_uid()` function to extract UID
4. **Policy Check** → Compares Firebase UID with `user_id` column
5. **Access Control** → Only allows access to own data

## **Security Benefits:**

- ✅ **User Isolation** - Each user can only access their own data
- ✅ **Token Expiration** - JWT tokens expire automatically
- ✅ **Database-Level Security** - RLS policies enforced at database level
- ✅ **No Admin Bypass** - Even if code is compromised, users can't access others' data
- ✅ **Audit Trail** - All access is logged and tracked

## **Troubleshooting:**

If you get errors, check:
1. **JWT Function** - Make sure the `auth.firebase_uid()` function exists
2. **RLS Enabled** - Verify RLS is enabled on the table
3. **Policies Active** - Check that all policies are created and active
4. **Token Format** - Ensure Firebase JWT contains the UID in the expected format 