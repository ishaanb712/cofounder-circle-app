import { createClient } from '@supabase/supabase-js';

// Client with anon key (respects RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Use anon key for client-side
);

export { supabaseAdmin }; 