import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: any;
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: 'student' | 'teacher' | 'admin';
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  is_active: boolean | null;
  email_verified: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  date_of_birth: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_relationship: string | null;
  music_experience_level: string | null;
  learning_goals: string | null;
  availability: string | null;
  timezone: string | null;
}

export class AuthService {
  // Unified signup method for all roles
  static async signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: 'student' | 'teacher' | 'admin' = 'student'
  ): Promise<AuthResponse> {
    const redirectUrl = `${window.location.origin}/auth`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
          role,
          provider: 'email'
        }
      }
    });

    return { user: data.user, session: data.session, error };
  }

  // Universal sign in
  static async signIn(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    return { user: data.user, session: data.session, error };
  }

  // Google OAuth
  static async signInWithGoogle(): Promise<{ error: any }> {
    const redirectUrl = `${window.location.origin}/auth`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    return { error };
  }

  // Sign out
  static async signOut(): Promise<{ error: any }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  // Get current user profile
  static async getCurrentProfile(): Promise<{ profile: Profile | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { profile: null, error: null };
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        return { profile: null, error };
      }

      // Fetch role from user_roles table
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .order('role', { ascending: true })
        .limit(1)
        .maybeSingle();

      // Override profile role with user_roles data
      if (roleData) {
        profile.role = roleData.role;
      }

      return { profile: profile as Profile, error: null };
    } catch (error) {
      console.error('Error in getCurrentProfile:', error);
      return { profile: null, error };
    }
  }

  // Update profile (excluding role)
  static async updateProfile(
    userId: string,
    updates: Partial<Omit<Profile, 'id' | 'role' | 'created_at' | 'updated_at'>>
  ): Promise<{ profile: Profile | null; error: any }> {
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    return { profile: profile as Profile, error };
  }

  // Admin-only: Assign role to user via user_roles table
  static async assignUserRole(userId: string, role: 'student' | 'teacher' | 'admin'): Promise<{ error: any }> {
    const { error } = await supabase.rpc('assign_user_role', {
      user_id: userId,
      new_role: role
    });

    return { error };
  }

  // Check user permissions
  static async hasRole(role: 'student' | 'teacher' | 'admin'): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', role)
        .maybeSingle();

      return !!roleData;
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  }

  static async isAdmin(): Promise<boolean> {
    return this.hasRole('admin');
  }

  static async isTeacher(): Promise<boolean> {
    return this.hasRole('teacher');
  }

  static async isStudent(): Promise<boolean> {
    return this.hasRole('student');
  }
}