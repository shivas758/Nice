import { User } from "lucide-react";
import { useState } from "react";
import { ImageViewDialog } from "./ImageViewDialog";

interface ViewableProfilePictureProps {
  avatarUrl: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  disableView?: boolean;
}

export const ViewableProfilePicture = ({ 
  avatarUrl, 
  size = "md",
  className = "",
  disableView = false
}: ViewableProfilePictureProps) => {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20"
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event from bubbling up
    if (avatarUrl && !disableView) {
      setIsViewDialogOpen(true);
    }
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div
        className={`w-full h-full bg-gray-200 rounded-full flex items-center justify-center overflow-hidden ${!disableView ? 'cursor-pointer' : ''}`}
        onClick={handleClick}
      >
        {avatarUrl ? (
          <>
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            {!disableView && (
              <div className="absolute inset-0 bg-black opacity-0 hover:opacity-30 transition-opacity" />
            )}
          </>
        ) : (
          <User className={`${iconSizes[size]} text-gray-400`} />
        )}
      </div>
      {!disableView && (
        <ImageViewDialog 
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          imageUrl={avatarUrl}
        />
      )}
    </div>
  );
};