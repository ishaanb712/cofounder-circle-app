import { createClient } from '@supabase/supabase-js';
import { User, Session } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  user_type?: 'student' | 'founder' | 'mentor' | 'vendor' | 'professional';
  google_id?: string;
}

export interface SignInResult {
  user: AuthUser | null;
  error: string | null;
}

export const signInWithGoogle = async (): Promise<SignInResult> => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: null, error: null }; // User will be redirected
  } catch (error) {
    return { user: null, error: 'Failed to sign in with Google' };
  }
};

export const signOut = async (): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message || null };
  } catch (error) {
    return { error: 'Failed to sign out' };
  }
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    // Get user profile from our custom table
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile) {
      return {
        id: user.id,
        email: user.email || '',
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        user_type: profile.user_type,
        google_id: profile.google_id,
      };
    }

    return {
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name,
      avatar_url: user.user_metadata?.avatar_url,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<AuthUser>
): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        email: updates.email,
        full_name: updates.full_name,
        avatar_url: updates.avatar_url,
        user_type: updates.user_type,
        google_id: updates.google_id,
        updated_at: new Date().toISOString(),
      });

    return { error: error?.message || null };
  } catch (error) {
    return { error: 'Failed to update user profile' };
  }
};

export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      const user = await getCurrentUser();
      callback(user);
    } else if (event === 'SIGNED_OUT') {
      callback(null);
    }
  });
}; 