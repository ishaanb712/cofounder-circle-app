# 🔧 Troubleshooting JWT Signature Issue

## **Problem:**
```
JWSError JWSInvalidSignature
```

This error occurs because Supabase doesn't recognize Firebase JWT tokens by default.

## **Solution 1: Disable RLS Temporarily (Quick Fix)**

Run this in your Supabase SQL Editor:

```sql
-- Temporarily disable RLS to test basic functionality
ALTER TABLE landing_page_user_profiles DISABLE ROW LEVEL SECURITY;
```

## **Solution 2: Use Service Role Key (Recommended for Production)**

1. **Get your Service Role Key:**
   - Go to Supabase Dashboard → Settings → API
   - Copy the **Service Role Key**

2. **Add to your `.env.local`:**
```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

3. **Update the code to use service role key:**
```typescript
// In firebase-secure.ts, replace the supabase client with:
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

## **Solution 3: Proper JWT Integration (Advanced)**

For true JWT-based security, you need to:

1. **Configure Supabase to accept Firebase JWTs:**
   - This requires custom JWT configuration
   - More complex setup

2. **Use Firebase Admin SDK on backend:**
   - Verify Firebase tokens on your backend
   - Pass verified user info to Supabase

## **Recommended Approach:**

For now, use **Solution 1** (disable RLS) to test basic functionality, then implement **Solution 2** (service role key) for production.

## **Test Steps:**

1. **Disable RLS temporarily**
2. **Test the authentication flow**
3. **Check if data is being stored**
4. **If it works, implement service role key approach**

This will get your authentication working while maintaining security through the service role key approach. 