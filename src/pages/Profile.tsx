import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
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

      // Update form data with existing profile data
      setFormData({
        first_name: existingProfile?.first_name || "",
        last_name: existingProfile?.last_name || "",
        profession: existingProfile?.profession || "",
        location: existingProfile?.location || "",
        languages: existingProfile?.languages || [],
      });

      return existingProfile;
    },
  });

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
    console.log("Input changed:", name, value);
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="pb-20 p-4">
      <ProfileHeader
        profile={profile}
        setIsEditing={setIsEditing}
        isLoading={isLoading}
        onProfileUpdate={refetch}
      />
      {!isLoading && (
        <EditProfileDialog
          isEditing={isEditing}
          setIsEditing={setIsEditing}
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