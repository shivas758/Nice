import { useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthError, AuthApiError } from '@supabase/supabase-js';
import { AuthLogo } from "@/components/auth/AuthLogo";
import { AuthHeader } from "@/components/auth/AuthHeader";
import AuthForm from "@/components/auth/AuthForm";  
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        // Check if user has completed profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('bio, display_name, date_of_birth, gcc_address, india_address, gcc_phone, india_phone')
          .eq('id', session.user.id)
          .single();

        // Profile is incomplete if any of these required fields are empty
        const isProfileIncomplete = !profile || 
          !profile.bio || 
          !profile.display_name || 
          !profile.date_of_birth || 
          !profile.gcc_address || 
          !profile.india_address || 
          !profile.gcc_phone || 
          !profile.india_phone;

        if (isProfileIncomplete) {
          navigate('/complete-profile');
        } else {
          navigate('/home');
        }
      }
      
      if (event === 'SIGNED_OUT') {
        setError(null);
      }

      if (event === 'USER_UPDATED') {
        const user = session?.user;
        if (user?.confirmed_at) {
          toast({
            title: "Email Verified",
            description: "Your email has been verified successfully. You can now sign in.",
          });
        }
      }
      
      // Handle specific auth events
      if (event === 'USER_DELETED' as any) {
        setError('Your account has been deleted.');
      }
      
      if (event === 'PASSWORD_RECOVERY') {
        setError(null);
      }
    });

    // Check for email confirmation success in URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get('type') === 'email_confirmation' && hashParams.get('error') === null) {
      toast({
        title: "Email Verified",
        description: "Your email has been verified successfully. You can now sign in.",
      });
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          if (error.message.includes('Invalid login credentials')) {
            return 'Invalid email or password. Please check your credentials and try again.';
          }
          if (error.message.includes('Email not confirmed')) {
            return 'Please verify your email address before signing in. Check your inbox for the verification link.';
          }
          return 'Invalid credentials. Please try again.';
        case 401:
          if (error.message.includes('Email not confirmed')) {
            return 'Please verify your email address before signing in. Check your inbox for the verification link.';
          }
          return 'Unauthorized access. Please try again.';
        case 422:
          return 'Invalid email format. Please enter a valid email address.';
        case 429:
          return 'Too many login attempts. Please try again later.';
        default:
          return error.message;
      }
    }
    return 'An unexpected error occurred. Please try again.';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <AuthLogo />
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl">
          <AuthHeader />
          <AuthForm error={error} />
        </div>
      </div>
    </div>
  );
};

export default Login;
