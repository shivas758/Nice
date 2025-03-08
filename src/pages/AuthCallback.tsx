import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the code from query parameters
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          toast({
            title: "Verification Failed",
            description: errorDescription || "Email verification failed. Please try again.",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }

        if (!code) {
          toast({
            title: "Error",
            description: "No verification code found. Please try again.",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }

        // Exchange the code for a session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) {
          console.error('Exchange error:', exchangeError);
          toast({
            title: "Error",
            description: "Failed to verify email. Please try again.",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }

        // Sign out to ensure clean state
        await supabase.auth.signOut();

        toast({
          title: "Email Verified",
          description: "Your email has been verified successfully. Please sign in with your credentials.",
        });

        navigate('/login');
      } catch (error) {
        console.error('Auth callback error:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Verifying Email...</h2>
        <p className="text-gray-600">Please wait while we verify your email address.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
