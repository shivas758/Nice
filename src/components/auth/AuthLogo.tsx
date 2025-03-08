import { cn } from "@/lib/utils";

interface AuthLogoProps {
  className?: string;
}

export const AuthLogo = ({ className }: AuthLogoProps) => {
  return (
    <div className={cn(
      "flex items-center justify-center w-32 h-32 mx-auto",
      className
    )}>
      <img
        src="/images/immigrant-community-logo.png"
        alt="NICE - Networking for Immigrants Care and Empowerment"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default AuthLogo;
