import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string | null;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  is_active: boolean | null;
  email_verified: boolean | null;
  google_id: string | null;
  provider: string | null;
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
  created_at: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string, role: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isTeacher: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = React.memo<{ children: React.ReactNode }>(({ children }) => {
  console.log('🔥 AuthProvider rendering...');
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔥 Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔥 Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('🔥 User authenticated, fetching profile...');
          // Fetch user profile with a small delay to ensure the trigger has run
          setTimeout(async () => {
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (error) {
              console.error('❌ Error fetching profile:', error);
              // If profile doesn't exist and this is a Google user, the trigger should have created it
              // Let's retry once more after a longer delay for Google OAuth
              if (session.user.app_metadata?.provider === 'google') {
                console.log('🔄 Retrying profile fetch for Google user...');
                setTimeout(async () => {
                  const { data: retryProfileData, error: retryError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                  
                  if (retryError) {
                    console.error('❌ Profile still not found after retry:', retryError);
                  } else {
                    console.log('✅ Profile found on retry:', retryProfileData);
                    setProfile(retryProfileData);
                  }
                }, 2000);
              }
            } else {
              console.log('✅ Profile fetched:', profileData);
              setProfile(profileData);
            }
          }, 1000); // Increased delay for Google OAuth
        } else {
          console.log('🔥 User signed out, clearing profile');
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    console.log('🔥 Checking for existing session...');
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔥 Existing session:', session?.user?.email || 'None');
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profileData, error }) => {
            if (error) {
              console.error('❌ Error fetching existing profile:', error);
            } else {
              console.log('✅ Existing profile loaded:', profileData);
              setProfile(profileData);
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string, role: string) => {
    console.log('🔥 Starting email sign up process for:', email);
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
          role: role,
          provider: 'email'
        }
      }
    });

    if (error) {
      console.error('❌ Email sign up error:', error);
      
      // Provide more specific error messages
      let errorMessage = error.message;
      if (error.message.includes('User already registered')) {
        errorMessage = 'An account with this email already exists. Please try signing in instead.';
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = 'Password must be at least 6 characters long.';
      } else if (error.message.includes('Unable to validate email address')) {
        errorMessage = 'Please enter a valid email address.';
      }
      
      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } else {
      console.log('✅ Email sign up successful - confirmation email sent');
      toast({
        title: "Check your email",
        description: "Please check your email for a confirmation link to complete your registration.",
      });
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔥 Starting email sign in process for:', email);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('❌ Email sign in error:', error);
      
      // Provide more specific error messages
      let errorMessage = error.message;
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link before signing in.';
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Too many login attempts. Please wait a moment before trying again.';
      }
      
      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } else {
      console.log('✅ Email sign in successful');
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    }

    return { error };
  };

  const signInWithGoogle = async () => {
    console.log('🔥 Starting Google sign in...');
    const redirectUrl = `${window.location.origin}/`;
    console.log('🔥 Redirect URL:', redirectUrl);
    
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

    if (error) {
      console.error('❌ Google sign in error:', error);
      
      // Provide more specific error messages
      let errorMessage = error.message;
      if (error.message.includes('provider is not enabled')) {
        errorMessage = 'Google authentication is not enabled. Please contact support.';
      }
      
      toast({
        title: "Google Sign In Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } else {
      console.log('✅ Google sign in initiated successfully');
    }

    return { error };
  };

  const signOut = async () => {
    console.log('🔥 Starting sign out process...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Sign out error:', error);
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      console.log('✅ Sign out successful');
      setUser(null);
      setSession(null);
      setProfile(null);
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    }
  };

  const isTeacher = profile?.role === 'teacher';
  const isStudent = profile?.role === 'student';

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    isTeacher,
    isStudent
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
});

AuthProvider.displayName = 'AuthProvider';
