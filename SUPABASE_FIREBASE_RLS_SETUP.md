# 🔐 RLS Policies for Firebase Auth + Supabase

## **Option 1: Service Role Key Approach (Recommended)**

Since Firebase JWT tokens don't work directly with Supabase RLS, use the service role key:

### **Step 1: Get Service Role Key**
1. Go to Supabase Dashboard → Settings → API
2. Copy the **Service Role Key** (not anon key)

### **Step 2: Add to Environment**
Add to your `.env.local`:
```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### **Step 3: Update Code to Use Service Role**
```typescript
// In firebase-secure.ts, replace the supabase client with:
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Use supabaseAdmin for all user profile operations
```

## **Option 2: Custom RLS with Firebase UID Function**

### **Step 1: Create Firebase UID Function**
```sql
-- Create function to extract Firebase UID from custom claims
CREATE OR REPLACE FUNCTION public.get_firebase_uid()
RETURNS text AS $$
BEGIN
  -- This would need to be customized based on your JWT structure
  RETURN current_setting('request.jwt.claims', true)::json->>'firebase_uid';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### **Step 2: Enable RLS**
```sql
-- Enable Row Level Security
ALTER TABLE landing_page_user_profiles ENABLE ROW LEVEL SECURITY;
```

### **Step 3: Create RLS Policies**
```sql
-- Insert policy
CREATE POLICY "Users can insert their own profile" ON landing_page_user_profiles
FOR INSERT WITH CHECK (public.get_firebase_uid() = user_id);

-- Select policy  
CREATE POLICY "Users can view their own profile" ON landing_page_user_profiles
FOR SELECT USING (public.get_firebase_uid() = user_id);

-- Update policy
CREATE POLICY "Users can update their own profile" ON landing_page_user_profiles
FOR UPDATE USING (public.get_firebase_uid() = user_id);

-- Delete policy
CREATE POLICY "Users can delete their own profile" ON landing_page_user_profiles
FOR DELETE USING (public.get_firebase_uid() = user_id);
```

## **Option 3: Hybrid Approach (Best for Production)**

### **Step 1: Use Service Role for User Operations**
```typescript
// For user profile operations (create/update/read own profile)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

### **Step 2: Use Anon Key with RLS for Other Operations**
```typescript
// For other operations that should respect RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### **Step 3: Enable RLS for Additional Security**
```sql
-- Enable RLS for additional security layers
ALTER TABLE landing_page_user_profiles ENABLE ROW LEVEL SECURITY;

-- Add policies for any additional operations
CREATE POLICY "Public read access" ON landing_page_user_profiles
FOR SELECT USING (true);
```

## **Recommended: Option 1 (Service Role Key)**

For your use case, I recommend **Option 1** because:
- ✅ **Simple implementation**
- ✅ **Reliable with Firebase Auth**
- ✅ **No JWT complexity**
- ✅ **Still secure** (service role key is protected)

Would you like me to implement the service role key approach? 