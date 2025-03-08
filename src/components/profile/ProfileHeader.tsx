import { useNavigate } from "react-router-dom";
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { HeaderActions } from "./HeaderActions";
import { ProfileInfo } from "./ProfileInfo";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileHeaderProps {
  profile: any;
  setIsEditing?: (value: boolean) => void;
  isLoading?: boolean;
  onProfileUpdate: () => void;
}

export const ProfileHeader = ({ profile, setIsEditing, isLoading = false, onProfileUpdate }: ProfileHeaderProps) => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const handleEditClick = () => {
    if (setIsEditing) {
      setIsEditing(true);
    }
  };

  return (
    <>
      <HeaderActions
        profile={profile}
        onEditClick={handleEditClick}
      />
      <ProfileInfo
        profile={profile}
        setIsEditProfileOpen={setIsEditProfileOpen}
        setIsEditing={setIsEditing}
        isLoading={isLoading}
        onProfileUpdate={onProfileUpdate}
      />
    </>
  );
};