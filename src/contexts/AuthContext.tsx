import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;

      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
      } else {
        throw new Error('No session returned after sign in');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `https://preview--niceconnect-community.lovable.app/auth/callback`,
          data: {
            email_confirmed: false
          }
        },
      });
      
      if (error) {
        if (error.message.includes('rate limit')) {
          throw new Error('Too many signup attempts. Please wait a few minutes before trying again.');
        }
        if (error.message.includes('Email rate limit')) {
          throw new Error('Too many verification emails sent. Please wait 60 minutes before requesting another email.');
        }
        throw error;
      }

      if (!data?.user) {
        throw new Error('Failed to create user account');
      }

      // Check if user already exists but needs confirmation
      if (data.user && !data.user.confirmed_at) {
        // User exists but email not confirmed
        toast({
          title: "Email Verification Required",
          description: "Please check your email for the verification link. If you don't see it, check your spam folder.",
        });
      }

      // Sign out immediately after signup to prevent auto-login
      await supabase.auth.signOut();

      toast({
        title: "Verification Email Sent",
        description: "Please check your email and click the verification link to complete your registration.",
      });
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Clear local state first
      setSession(null);
      setUser(null);
      
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        // Don't throw the error as we've already cleared local state
      }
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Don't throw the error as we've already cleared local state
    }
  };

  useEffect(() => {
    console.log('Setting up auth subscription');
    
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting initial session:', sessionError);
          toast({
            title: "Session Error",
            description: "There was a problem loading your session. Please try logging in again.",
            variant: "destructive",
          });
          return;
        }

        if (initialSession) {
          console.log('Initial session loaded:', initialSession.user?.email);
          setSession(initialSession);
          setUser(initialSession.user);
        } else {
          console.log('No initial session found');
          // Clear any stale session data
          await supabase.auth.signOut();
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed:', event, currentSession);
      
      if (event === 'SIGNED_IN' && currentSession) {
        console.log('User signed in:', currentSession.user?.email);
        setSession(currentSession);
        setUser(currentSession.user);
        // toast({
        //   title: "Signed In",
        //   description: "Welcome back!",
        // });
      }

      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setSession(null);
        setUser(null);
        // toast({
        //   title: "Signed Out",
        //   description: "You have been signed out.",
        // });
      }

      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed');
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
        }
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
