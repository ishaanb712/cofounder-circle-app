# 🔐 RLS with Firebase Auth + Supabase Storage

## **Option 1: Service Role Key (Recommended)**

### **Step 1: Get Service Role Key**
1. Go to Supabase Dashboard → Settings → API
2. Copy the **Service Role Key** (not the anon key)
3. Add it to your `.env.local`:
```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### **Step 2: Use Admin Client**
The code is now updated to use `supabaseAdmin` which bypasses RLS for user profile operations.

## **Option 2: Custom RLS Policies**

### **Step 1: Create JWT Function**
```sql
-- Create a function to extract Firebase UID from JWT
CREATE OR REPLACE FUNCTION auth.firebase_uid()
RETURNS text AS $$
BEGIN
  RETURN current_setting('request.jwt.claims', true)::json->>'firebase_uid';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### **Step 2: Update RLS Policies**
```sql
-- Enable RLS
ALTER TABLE landing_page_user_profiles ENABLE ROW LEVEL SECURITY;

-- Insert policy
CREATE POLICY "Users can insert their own profile" ON landing_page_user_profiles
FOR INSERT WITH CHECK (auth.firebase_uid() = user_id::text);

-- Select policy  
CREATE POLICY "Users can view their own profile" ON landing_page_user_profiles
FOR SELECT USING (auth.firebase_uid() = user_id::text);

-- Update policy
CREATE POLICY "Users can update their own profile" ON landing_page_user_profiles
FOR UPDATE USING (auth.firebase_uid() = user_id::text);
```

### **Step 3: Pass Firebase Token**
```typescript
// Get Firebase ID token and pass it to Supabase
const idToken = await auth.currentUser?.getIdToken();
const { data, error } = await supabase
  .from('landing_page_user_profiles')
  .select('*')
  .eq('user_id', userId)
  .headers({
    Authorization: `Bearer ${idToken}`
  });
```

## **Option 3: Hybrid Approach**

- Use **Service Role Key** for user profile operations (create/update)
- Use **Anon Key** with RLS for other operations (if needed)
- Keep RLS enabled for additional security layers

## **Recommended Setup:**

1. **Keep RLS enabled** on your table
2. **Use Service Role Key** for user profile operations
3. **Add the service role key** to your environment variables
4. **Test the authentication flow**

This gives you the security benefits of RLS while allowing Firebase Auth users to manage their profiles. 