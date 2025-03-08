import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  user: {
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const UserAvatar = ({ user, size = "md", className = "" }: UserAvatarProps) => {
  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName[0] : '';
    const lastInitial = lastName ? lastName[0] : '';
    return (firstInitial + lastInitial).toUpperCase();
  };

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const fontSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage
        src={user.avatar_url || ''}
        alt={`${user.first_name} ${user.last_name}`}
      />
      <AvatarFallback className={fontSizeClasses[size]}>
        {getInitials(user.first_name, user.last_name)}
      </AvatarFallback>
    </Avatar>
  );
};