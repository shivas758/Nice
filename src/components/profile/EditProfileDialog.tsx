import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfileForm } from "./ProfileForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface EditProfileDialogProps {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  formData: any;
  handleInputChange: (name: string, value: string | string[]) => void;
  handleUpdateProfile: () => void;
  professions: Array<{ id: number; name: string }>;
  locations: Array<{ id: number; name: string }>;
  languages: Array<{ id: number; name: string }>;
  profile: any;
}

export const EditProfileDialog = ({
  isEditing,
  setIsEditing,
  formData,
  handleInputChange,
  handleUpdateProfile,
  professions,
  locations,
  languages,
  profile,
}: EditProfileDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const onUpdateProfile = async () => {
    try {
      if (!user?.id) throw new Error("No user ID");

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          profession: formData.profession,
          location: formData.location,
          languages: formData.languages,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      
      setIsEditing(false);
      handleUpdateProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isEditing} onOpenChange={setIsEditing}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <ProfileForm
          formData={formData}
          handleInputChange={handleInputChange}
          professions={professions}
          locations={locations}
          languages={languages}
          profile={profile}
        />
        <Button onClick={onUpdateProfile} className="w-full">
          Save Changes
        </Button>
      </DialogContent>
    </Dialog>
  );
};
