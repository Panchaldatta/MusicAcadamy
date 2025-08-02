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
  // Student authentication
  static async signUpStudent(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<AuthResponse> {
    const redirectUrl = `${window.location.origin}/auth?tab=signin`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
          role: 'student',
          provider: 'email'
        }
      }
    });

    return {
      user: data.user,
      session: data.session,
      error
    };
  }

  // Teacher authentication
  static async signUpTeacher(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    teacherData?: {
      subject?: string;
      experience?: string;
      location?: string;
      specialties?: string[];
      languages?: string[];
    }
  ): Promise<AuthResponse> {
    const redirectUrl = `${window.location.origin}/auth/teacher?tab=signin`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
          role: 'teacher',
          provider: 'email',
          teacher_data: teacherData
        }
      }
    });

    return {
      user: data.user,
      session: data.session,
      error
    };
  }

  // Admin authentication (requires special invitation)
  static async signUpAdmin(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    adminCode: string
  ): Promise<AuthResponse> {
    // Verify admin code before proceeding
    if (adminCode !== 'ADMIN_INVITE_2024') {
      return {
        user: null,
        session: null,
        error: { message: 'Invalid admin invitation code' }
      };
    }

    const redirectUrl = `${window.location.origin}/auth/admin?tab=signin`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
          role: 'admin',
          provider: 'email'
        }
      }
    });

    return {
      user: data.user,
      session: data.session,
      error
    };
  }

  // Universal sign in
  static async signIn(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    return {
      user: data.user,
      session: data.session,
      error
    };
  }

  // Google OAuth with role selection
  static async signInWithGoogle(role: 'student' | 'teacher' = 'student'): Promise<{ error: any }> {
    const redirectUrl = `${window.location.origin}/auth?tab=signin`;
    
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
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { profile: null, error: null };
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return { profile: profile as Profile, error };
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

  // Admin-only: Assign role to user
  static async assignUserRole(userId: string, role: 'student' | 'teacher' | 'admin'): Promise<{ error: any }> {
    // Verify current user is admin
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single();

    if (currentProfile?.role !== 'admin') {
      return { error: { message: 'Unauthorized: Only admins can assign roles' } };
    }

    // Update the user's role
    const { error } = await supabase
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId);

    return { error };
  }

  // Teacher registration after signup
  static async registerTeacher(teacherData: {
    name: string;
    subject: string;
    experience: string;
    location: string;
    price?: number;
    specialties?: string[];
    languages?: string[];
  }): Promise<{ teacherId: string | null; error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { teacherId: null, error: { message: 'User not authenticated' } };
    }

    // Verify the user is a teacher
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'teacher') {
      return { teacherId: null, error: { message: 'Unauthorized or user is not a teacher' } };
    }

    // Create teacher record
    const { data: teacher, error } = await supabase
      .from('teachers')
      .insert({
        id: user.id,
        name: teacherData.name,
        subject: teacherData.subject,
        experience: teacherData.experience,
        location: teacherData.location,
        price: teacherData.price || 50,
        specialties: teacherData.specialties || [],
        languages: teacherData.languages || ['English'],
        verified: false
      })
      .select('id')
      .single();

    return { teacherId: teacher?.id || null, error };
  }

  // Check user permissions
  static async hasRole(role: 'student' | 'teacher' | 'admin'): Promise<boolean> {
    const { profile } = await this.getCurrentProfile();
    return profile?.role === role || false;
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