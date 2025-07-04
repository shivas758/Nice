import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { OTPVerification } from "./OTPVerification";
import { AuthFormFields } from "./AuthFormFields";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";
import type { Tables } from '@/integrations/supabase/types';

interface AuthFormProps {
  error?: string | null;
}

const AuthForm = ({ error }: AuthFormProps) => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [profession, setProfession] = useState("");
  const [language, setLanguage] = useState("");
  const [maritalStatus, setMaritalStatus] = useState(false);
  const [education, setEducation] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([]);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const [countryCodes, setCountryCodes] = useState<Tables<'country_codes'>[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const resendTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: professions } = useQuery({
    queryKey: ["professions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("professions").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: languages } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("languages").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: communities } = useQuery({
    queryKey: ["forums"],
    queryFn: async () => {
      const { data, error } = await supabase.from("forums").select("*");
      if (error) throw error;
      return data;
    },
  });

  // Fetch country codes from Supabase
  useEffect(() => {
    const fetchCountryCodes = async () => {
      const { data, error } = await supabase
        .from('country_codes')
        .select('country, code')
        .eq('is_active', true);
      if (!error && data) {
        setCountryCodes(data as Tables<'country_codes'>[]);
        // Prefer +91 (India) as default if present
        const india = (data as Tables<'country_codes'>[]).find(c => c.code === '91');
        setSelectedCountryCode(india ? india.code : (data[0]?.code || ''));
      }
    };
    fetchCountryCodes();
  }, []);

  // Cooldown timer for resend OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      resendTimerRef.current = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => {
      if (resendTimerRef.current) clearTimeout(resendTimerRef.current);
    };
  }, [resendCooldown]);

  const getFullPhone = () => `+${selectedCountryCode}${mobileNumber}`;

  const handleSendOTP = async () => {
    if (!mobileNumber || !selectedCountryCode) {
      toast({
        title: "Error",
        description: "Please select country code and enter a mobile number",
        variant: "destructive",
      });
      return;
    }
    try {
      // const response = await fetch("http://localhost:5001/send-otp", {
      const response = await fetch("https://nicebackend.netlify.app/send-otp", {
      // const response = await fetch("https://nicebackend.netlify.app/.netlify/functions/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: getFullPhone() }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }
      toast({
        title: "Success",
        description: "OTP sent successfully! Please check your SMS.",
      });
      setShowOTP(true);
      setResendCooldown(30); // 30 seconds cooldown
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to send OTP",
        variant: "destructive",
      });
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast({
        title: "Error",
        description: "Please enter the OTP",
        variant: "destructive",
      });
      return;
    }
    try {
      // const response = await fetch("http://localhost:5001/verify-otp", {
      const response = await fetch("https://nicebackend.netlify.app/verify-otp",{
      // const response = await fetch("https://nicebackend.netlify.app/.netlify/functions/send-otp",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: getFullPhone(), otp }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "OTP verification failed");
      }
      setIsOTPVerified(true);
      toast({
        title: "Success",
        description: "Mobile number verified successfully!",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "OTP verification failed",
        variant: "destructive",
      });
    }
  };

  const validateSignUpFields = () => {
    if (!firstName || !lastName || !profession || !language || !education) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        if (!validateSignUpFields()) return;

        if (!isOTPVerified) {
          toast({
            title: "Error",
            description: "Please verify your mobile number",
            variant: "destructive",
          });
          return;
        }

        console.log('Checking existing user by mobile number:', mobileNumber);
        const { data: existingUser, error: checkError } = await supabase
          .from("profiles")
          .select("id")
          .eq("mobile_number", mobileNumber)
          .maybeSingle();

        if (checkError) {
          console.error('Error checking existing user:', checkError);
          throw checkError;
        }

        if (existingUser) {
          console.log('Found existing user:', existingUser);
          toast({
            title: "Error",
            description: "A user with this mobile number already exists",
            variant: "destructive",
          });
          return;
        }

        try {
          console.log('Attempting to sign up user with email:', email);
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `https://niceaapppp.netlify.app`,
              data: {
                email_confirmed: false
              }
            }
          });

          if (signUpError) {
            if (signUpError.message.includes('rate limit')) {
              toast({
                title: "Rate Limit Exceeded",
                description: "Too many signup attempts. Please wait a few minutes before trying again.",
                variant: "destructive",
              });
              return;
            }
            if (signUpError.message.includes('Email rate limit')) {
              toast({
                title: "Email Rate Limit Exceeded",
                description: "Too many verification emails sent. Please wait 60 minutes before trying again.",
                variant: "destructive",
              });
              return;
            }
            throw signUpError;
          }

          if (signUpData?.user) {
            setIsVerificationEmailSent(true);
            console.log('User created successfully:', signUpData.user.id);

            const profileData = {
              id: signUpData.user.id,
              first_name: firstName,
              last_name: lastName,
              gender,
              profession,
              languages: [language],
              is_married: maritalStatus,
              education_level: education,
              mobile_number: mobileNumber,
              otp_verified: true,
              email_confirmed: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };

            console.log('Checking if profile exists...');
            const { data: existingProfile } = await supabase
              .from("profiles")
              .select("id")
              .eq("id", signUpData.user.id)
              .maybeSingle();

            let savedProfile;
            let profileError;

            if (existingProfile) {
              console.log('Profile exists, updating...');
              ({ error: profileError, data: savedProfile } = await supabase
                .from("profiles")
                .update(profileData)
                .eq('id', signUpData.user.id)
                .select()
                .single());
            } else {
              console.log('Profile does not exist, creating new...');
              ({ error: profileError, data: savedProfile } = await supabase
                .from("profiles")
                .insert(profileData)
                .select()
                .single());
            }

            if (profileError) {
              console.error('Profile creation/update failed:', profileError);
              console.error('Profile error details:', {
                message: profileError.message,
                details: profileError.details,
                hint: profileError.hint,
                code: profileError.code
              });
              toast({
                title: "Profile Creation Error",
                description: profileError.message,
                variant: "destructive",
              });
              throw profileError;
            }

            console.log('Profile saved successfully:', savedProfile);

            // Handle community selection
            if (selectedCommunities.length > 0) {
              console.log('Adding user to communities:', selectedCommunities);
              const userForums = selectedCommunities.map(communityId => ({
                user_id: signUpData.user.id,
                forum_id: communityId,
                created_at: new Date().toISOString()
              }));

              const { error: communityError } = await supabase
                .from("user_forums")
                .insert(userForums);

              if (communityError) {
                console.error('Error adding user to communities:', communityError);
                throw communityError;
              }
              console.log('Communities added successfully');
            }

            toast({
              title: "Success",
              description: "Please check your email and click the verification link to complete your registration.",
            });
          }
        } catch (signUpError: any) {
          console.error('Sign up error:', signUpError);
          if (signUpError.message.includes('already registered')) {
            toast({
              title: "Account Exists",
              description: "This email is already registered. Please check your email for the verification link or try signing in.",
              variant: "destructive",
            });
            return;
          }
          throw signUpError;
        }
      } else {
        await signIn(email, password);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to authenticate. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center p-8 max-w-400 mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isSignUp ? "Sign Up" : "Sign In"}
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {isVerificationEmailSent ? (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Verify Your Email</h2>
          <p className="text-gray-600">
            We've sent a verification email to <span className="font-medium">{email}</span>.
            Please check your inbox and click the verification link to complete your registration.
          </p>
          <button
            className="mt-4 text-blue-500"
            onClick={() => {
              setIsSignUp(false);
              setIsVerificationEmailSent(false);
            }}
          >
            Return to Sign In
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {isSignUp ? (
            <>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="border p-2 rounded w-full"
                />
                <div className="flex items-center gap-4">
                  <label className="font-medium">Gender:</label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={gender === "Male"}
                      onChange={() => setGender("Male")}
                      required
                    />
                    Male
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={gender === "Female"}
                      onChange={() => setGender("Female")}
                      required
                    />
                    Female
                  </label>
                </div>
                <Select value={profession} onValueChange={setProfession}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select profession" />
                  </SelectTrigger>
                  <SelectContent>
                    {professions?.map((p) => (
                      <SelectItem key={p.id} value={p.name}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages?.map((l) => (
                      <SelectItem key={l.id} value={l.name}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={education} onValueChange={setEducation}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    {["10th", "12th", "Undergraduate", "Postgraduate"].map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Communities</label>
                  <div className="border p-2 rounded max-h-40 overflow-y-auto">
                    {communities?.map((community) => (
                      <div key={community.id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={`community-${community.id}`}
                          checked={selectedCommunities.includes(community.id)}
                          onCheckedChange={() => {
                            const newSelectedCommunities = selectedCommunities.includes(community.id)
                              ? selectedCommunities.filter(id => id !== community.id)
                              : [...selectedCommunities, community.id];
                            setSelectedCommunities(newSelectedCommunities);
                          }}
                        />
                        <label htmlFor={`community-${community.id}`} className="text-sm">
                          {community.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium mb-1">Mobile Number</label>
                  <div className="flex flex-row items-center gap-2">
                    <Select value={selectedCountryCode} onValueChange={setSelectedCountryCode}>
                      <SelectTrigger className="w-full min-w-fit text-xs">
                        <SelectValue>
                          {selectedCountryCode
                            ? (() => {
                                const selected = countryCodes.find(c => c.code === selectedCountryCode);
                                return selected ? `+${selected.code} (${selected.country})` : 'Code';
                              })()
                            : 'Code'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {countryCodes.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            +{c.code} ({c.country})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      required
                      className="border p-2 rounded flex-1 min-w-[120px] max-w-[180px] text-base tracking-widest"
                      disabled={isOTPVerified}
                      maxLength={12}
                      inputMode="numeric"
                    />
                    {!showOTP && !isOTPVerified && (
                      <Button
                        type="button"
                        onClick={handleSendOTP}
                        className="whitespace-nowrap bg-violet-500 hover:bg-violet-600 text-white px-2 py-1 text-xs min-w-fit"
                        disabled={resendCooldown > 0}
                      >
                        {resendCooldown > 0 ? `Resend OTP (${resendCooldown})` : "Send OTP"}
                      </Button>
                    )}
                    {isOTPVerified && (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="w-5 h-5" />
                        <span className="text-sm">Verified</span>
                      </div>
                    )}
                  </div>
                  {/* OTP input and resend button */}
                  {showOTP && !isOTPVerified && (
                    <div className="flex flex-row items-center gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        maxLength={6}
                        className="border p-2 rounded flex-1 min-w-[100px] max-w-[120px] text-base tracking-widest"
                        inputMode="numeric"
                      />
                      <Button
                        type="button"
                        onClick={handleVerifyOTP}
                        className="whitespace-nowrap bg-violet-500 hover:bg-violet-600 text-white px-2 py-1 text-xs min-w-fit"
                      >
                        Verify OTP
                      </Button>
                      {resendCooldown > 0 ? (
                        <span className="text-xs text-gray-500 ml-2">Resend in {resendCooldown}s</span>
                      ) : (
                        <Button
                          type="button"
                          onClick={handleSendOTP}
                          className="whitespace-nowrap bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 text-xs min-w-fit"
                        >
                          Resend OTP
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : null}

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border p-2 rounded w-full"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border p-2 rounded w-full"
            />
          </div>

          <Button type="submit" className="w-full bg-violet-500 hover:bg-violet-600">
            {isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>
      )}

      {!isVerificationEmailSent && (
        <button
          className="mt-4 text-blue-500"
          onClick={() => {
            setIsSignUp((prev) => !prev);
            setShowOTP(false);
            setOtp("");
            setIsOTPVerified(false);
            // Clear all fields when switching between sign in and sign up
            if (!isSignUp) {
              setEmail("");
              setPassword("");
            } else {
              setFirstName("");
              setLastName("");
              setProfession("");
              setLanguage("");
              setEducation("");
              setSelectedCommunities([]);
              setMobileNumber("");
            }
          }}
        >
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </button>
      )}
    </div>
  );
};

export default AuthForm;
