import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OTPVerificationProps {
  mobileNumber: string;
  onMobileNumberChange: (value: string) => void;
  onSendOTP: () => void;
  onOTPChange: (value: string) => void;
  onVerifyOTP: () => void;
  otp: string;
  showOTP: boolean;
  isVerified?: boolean;
}

export const OTPVerification = ({
  mobileNumber,
  onMobileNumberChange,
  onSendOTP,
  onOTPChange,
  onVerifyOTP,
  otp,
  showOTP,
  isVerified = false,
}: OTPVerificationProps) => {
  const { toast } = useToast();

  const handleSendOTP = () => {
    if (!mobileNumber) {
      toast({
        title: "Error",
        description: "Please enter a mobile number",
        variant: "destructive",
      });
      return;
    }
    onSendOTP();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="tel"
          placeholder="Mobile Number"
          value={mobileNumber}
          onChange={(e) => onMobileNumberChange(e.target.value)}
          required
          className="border p-2 rounded flex-1"
          disabled={isVerified}
        />
        {!showOTP && !isVerified && (
          <Button
            type="button"
            onClick={handleSendOTP}
            className="whitespace-nowrap bg-violet-500 hover:bg-violet-600 text-white"
          >
            Send OTP
          </Button>
        )}
        {isVerified && (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="w-5 h-5" />
            <span className="text-sm">Verified</span>
          </div>
        )}
      </div>
      
      {showOTP && !isVerified && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Enter OTP:</p>
          <div className="flex gap-2">
            <InputOTP
              value={otp}
              onChange={(value) => onOTPChange(value)}
              maxLength={6}
              className="flex-1"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <Button
              type="button"
              onClick={onVerifyOTP}
              className="whitespace-nowrap bg-violet-500 hover:bg-violet-600 text-white"
            >
              Verify OTP
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
