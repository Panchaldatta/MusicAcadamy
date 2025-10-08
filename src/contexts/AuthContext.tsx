import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthService, Profile } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  userRoles: string[];
  loading: boolean;
  
  // Student authentication
  signUpStudent: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any }>;
  
  // Teacher authentication
  signUpTeacher: (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string,
    teacherData?: any
  ) => Promise<{ error: any }>;
  
  // Admin authentication
  signUpAdmin: (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ) => Promise<{ error: any }>;
  
  // Universal sign in
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: (role?: 'student' | 'teacher') => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  
  // Role checks
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  
  // Profile management
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
  
  // Admin functions
  assignRole: (userId: string, role: 'student' | 'teacher' | 'admin') => Promise<{ error: any }>;
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
  console.log('🔥 AuthProvider rendering...');
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔥 Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔥 Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('🔥 User authenticated, fetching profile...');
          // Fetch user profile
          setTimeout(async () => {
            const { profile: profileData, error } = await AuthService.getCurrentProfile();
            
            if (error) {
              console.error('❌ Error fetching profile:', error);
              // Retry for Google OAuth users
              if (session.user.app_metadata?.provider === 'google') {
                console.log('🔄 Retrying profile fetch for Google user...');
                setTimeout(async () => {
                  const { profile: retryProfile, error: retryError } = await AuthService.getCurrentProfile();
                  
                  if (retryError) {
                    console.error('❌ Profile still not found after retry:', retryError);
                  } else {
                    console.log('✅ Profile found on retry:', retryProfile);
                    setProfile(retryProfile);
                  }
                }, 2000);
              }
            } else {
              console.log('✅ Profile fetched:', profileData);
              setProfile(profileData);
            }
            
            // Fetch user roles from user_roles table
            const { data: roles } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id);
            
            if (roles) {
              const roleStrings = roles.map(r => r.role);
              console.log('✅ Roles fetched:', roleStrings);
              setUserRoles(roleStrings);
            }
          }, 1000);
        } else {
          console.log('🔥 User signed out, clearing profile');
          setProfile(null);
          setUserRoles([]);
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
        AuthService.getCurrentProfile().then(({ profile: profileData, error }) => {
          if (error) {
            console.error('❌ Error fetching existing profile:', error);
          } else {
            console.log('✅ Existing profile loaded:', profileData);
            setProfile(profileData);
          }
          
          // Fetch user roles
          supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .then(({ data: roles }) => {
              if (roles) {
                const roleStrings = roles.map(r => r.role);
                console.log('✅ Existing roles loaded:', roleStrings);
                setUserRoles(roleStrings);
              }
              setLoading(false);
            });
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Student signup
  const signUpStudent = async (email: string, password: string, firstName: string, lastName: string) => {
    const { error } = await AuthService.signUpStudent(email, password, firstName, lastName);
    
    if (error) {
      console.error('❌ Student sign up error:', error);
      toast({
        title: "Student Sign Up Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      console.log('✅ Student sign up successful');
      toast({
        title: "Check your email",
        description: "Please check your email for a confirmation link to complete your student registration.",
      });
    }

    return { error };
  };

  // Teacher signup
  const signUpTeacher = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string,
    teacherData?: any
  ) => {
    const { error } = await AuthService.signUpTeacher(email, password, firstName, lastName, teacherData);
    
    if (error) {
      console.error('❌ Teacher sign up error:', error);
      toast({
        title: "Teacher Sign Up Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      console.log('✅ Teacher sign up successful');
      toast({
        title: "Check your email",
        description: "Please check your email for a confirmation link to complete your teacher registration.",
      });
    }

    return { error };
  };

  // Admin signup
  const signUpAdmin = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ) => {
    const { error } = await AuthService.signUpAdmin(email, password, firstName, lastName);
    
    if (error) {
      console.error('❌ Admin sign up error:', error);
      toast({
        title: "Admin Sign Up Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      console.log('✅ Admin sign up successful');
      toast({
        title: "Check your email",
        description: "Please check your email for a confirmation link to complete your admin registration.",
      });
    }

    return { error };
  };

  // Sign in
  const signIn = async (email: string, password: string) => {
    const { error } = await AuthService.signIn(email, password);
    
    if (error) {
      console.error('❌ Sign in error:', error);
      let errorMessage = error.message;
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      }
      
      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } else {
      console.log('✅ Sign in successful');
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    }

    return { error };
  };

  // Google sign in
  const signInWithGoogle = async (role: 'student' | 'teacher' = 'student') => {
    const { error } = await AuthService.signInWithGoogle(role);
    
    if (error) {
      console.error('❌ Google sign in error:', error);
      toast({
        title: "Google Sign In Failed",
        description: error.message,
        variant: "destructive"
      });
    }

    return { error };
  };

  // Sign out
  const signOut = async () => {
    const { error } = await AuthService.signOut();
    
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
      setUserRoles([]);
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    }
  };

  // Profile update
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: { message: 'User not authenticated' } };
    }

    const { profile: updatedProfile, error } = await AuthService.updateProfile(user.id, updates);
    
    if (error) {
      console.error('❌ Profile update error:', error);
      toast({
        title: "Profile Update Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      console.log('✅ Profile updated successfully');
      setProfile(updatedProfile);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    }

    return { error };
  };

  // Admin: Assign role
  const assignRole = async (userId: string, role: 'student' | 'teacher' | 'admin') => {
    const { error } = await AuthService.assignUserRole(userId, role);
    
    if (error) {
      console.error('❌ Role assignment error:', error);
      toast({
        title: "Role Assignment Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      console.log('✅ Role assigned successfully');
      // Refresh roles after assignment if it's the current user
      if (user && userId === user.id) {
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId);
        if (roles) {
          setUserRoles(roles.map(r => r.role));
        }
      }
      toast({
        title: "Role Assigned",
        description: `User role has been updated to ${role}.`,
      });
    }

    return { error };
  };

  // Role checks
  const hasRole = (role: string) => userRoles.includes(role);
  const isAdmin = userRoles.includes('admin');
  const isTeacher = userRoles.includes('teacher');
  const isStudent = userRoles.includes('student');

  const value = {
    user,
    session,
    profile,
    userRoles,
    loading,
    signUpStudent,
    signUpTeacher,
    signUpAdmin,
    signIn,
    signInWithGoogle,
    signOut,
    hasRole,
    isAdmin,
    isTeacher,
    isStudent,
    updateProfile,
    assignRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};