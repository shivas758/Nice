import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ className, size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  return (
    <div className={cn(
      "relative flex items-center justify-center transform hover:scale-105 transition-transform duration-200",
      sizeClasses[size],
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

export default Logo;
