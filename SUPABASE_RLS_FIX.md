# 🔧 Fixing Supabase RLS Policies for Firebase Auth

## **Problem:**
Your RLS policies are set up for Supabase Auth users, but we're using Firebase Auth. The policies check for `auth.uid()` which doesn't match Firebase Auth UIDs.

## **Solution 1: Disable RLS (Recommended)**

### **Step 1: Disable RLS on the table**
In your Supabase dashboard:
1. Go to **Authentication** → **Policies**
2. Find the `landing_page_user_profiles` table
3. Click **"Disable RLS"** for this table

### **Step 2: Alternative - Create a service role key**
If you want to keep RLS enabled, you can use a service role key for admin operations:

```typescript
// In your Supabase dashboard, create a service role key
// Then use it for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key, not anon key
);
```

## **Solution 2: Switch to Supabase Auth**

If you prefer to use Supabase Auth instead of Firebase Auth:

1. **Update Firebase config to use Supabase Auth:**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  });
  return { user: data.user, error };
};
```

2. **Update RLS policies to work with Supabase Auth:**
```sql
-- Enable RLS
ALTER TABLE landing_page_user_profiles ENABLE ROW LEVEL SECURITY;

-- Insert policy
CREATE POLICY "Users can insert their own profile" ON landing_page_user_profiles
FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Select policy  
CREATE POLICY "Users can view their own profile" ON landing_page_user_profiles
FOR SELECT USING (auth.uid()::text = user_id::text);

-- Update policy
CREATE POLICY "Users can update their own profile" ON landing_page_user_profiles
FOR UPDATE USING (auth.uid()::text = user_id::text);
```

## **Recommended Approach:**
For now, **disable RLS** on the `landing_page_user_profiles` table since we're using Firebase Auth. This will allow the authentication flow to work properly.

## **To Disable RLS:**
1. Go to your Supabase dashboard
2. Navigate to **Authentication** → **Policies**
3. Find `landing_page_user_profiles` table
4. Click **"Disable RLS"**

This will allow the Firebase Auth users to create and access their profiles in Supabase. 