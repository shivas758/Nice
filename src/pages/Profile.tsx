import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleEditDialogState = (state: boolean) => {
    console.log("Setting edit state to:", state);
    setIsEditing(state);
  };
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    profession: "",
    location: "",
    languages: [] as string[],
  });
  
  // Fetch profile data
  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user ID");
      
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (fetchError) throw fetchError;

      return existingProfile;
    },
  });

  // Initialize form data with profile data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        profession: profile.profession || "",
        location: profile.location || "",
        languages: profile.languages || [],
      });
    }
  }, [profile]);



  // Fetch dropdown options
  const { data: professions } = useQuery({
    queryKey: ["professions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("professions")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: locations } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: languages } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Handle input changes
  const handleInputChange = (name: string, value: string | string[]) => {
    try {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    } catch (error) {
      console.error("Error updating form data:", error);
    }
  };

  const handleEditClose = () => {
    try {
      setIsEditing(false);
      // Reset form data to current profile values
      if (profile) {
        setFormData({
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          profession: profile.profession || "",
          location: profile.location || "",
          languages: profile.languages || [],
        });
      }
    } catch (error) {
      console.error("Error closing edit dialog:", error);
    }
  };

  return (
    <div className="pb-20 p-4">
      <ProfileHeader
        profile={profile}
        setIsEditing={handleEditDialogState}
        isLoading={isLoading}
        onProfileUpdate={refetch}
      />
      {!isLoading && (
        <EditProfileDialog
          isEditing={isEditing}
          setIsEditing={handleEditDialogState}
          formData={formData}
          handleInputChange={handleInputChange}
          handleUpdateProfile={refetch}
          professions={professions || []}
          locations={locations || []}
          languages={languages || []}
          profile={profile}
        />
      )}
    </div>
  );
};

export default Profile;
