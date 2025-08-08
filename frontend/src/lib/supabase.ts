import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserProfile {
  id?: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'founder' | 'investor' | 'mentor' | 'job_seeker' | 'service_provider';
  company?: string;
  use_case?: string;
  linkedin_url?: string;
  phone?: string;
  location?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
} 