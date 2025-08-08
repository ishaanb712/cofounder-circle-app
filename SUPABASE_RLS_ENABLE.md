# 🔐 Enable RLS with Service Role Key Security

## **Step 1: Enable RLS**
```sql
-- Enable Row Level Security
ALTER TABLE landing_page_user_profiles ENABLE ROW LEVEL SECURITY;
```

## **Step 2: Add Basic Security Policies**
```sql
-- Policy for public read access (optional - for public profiles)
CREATE POLICY "Public read access" ON landing_page_user_profiles
FOR SELECT USING (true);

-- Policy to prevent unauthorized inserts (service role key bypasses this)
CREATE POLICY "Service role only inserts" ON landing_page_user_profiles
FOR INSERT WITH CHECK (false);

-- Policy to prevent unauthorized updates (service role key bypasses this)
CREATE POLICY "Service role only updates" ON landing_page_user_profiles
FOR UPDATE USING (false);

-- Policy to prevent unauthorized deletes (service role key bypasses this)
CREATE POLICY "Service role only deletes" ON landing_page_user_profiles
FOR DELETE USING (false);
```

## **How This Works:**

- ✅ **RLS Enabled** - Provides database-level security
- ✅ **Service Role Key** - Bypasses RLS for authorized operations
- ✅ **Policies Block Unauthorized Access** - Prevents direct anon key access
- ✅ **Firebase Auth** - Handles user authentication
- ✅ **Admin Operations** - Service role key handles user profile operations

## **Security Benefits:**

1. **Database-Level Security** - RLS policies are enforced
2. **Service Role Protection** - Only your app can bypass RLS
3. **Firebase Auth** - Handles user authentication securely
4. **No JWT Complexity** - Simple and reliable approach

## **Test After Enabling:**

1. Run the SQL commands above
2. Visit `http://localhost:3000/test-jwt-security`
3. Sign in with Google
4. Check that user profiles are still being created

The service role key approach gives you enterprise-level security without the complexity of JWT token management! 