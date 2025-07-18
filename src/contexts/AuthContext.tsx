
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Check your email",
        description: "Please check your email for a confirmation link.",
      });
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
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
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
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
};
