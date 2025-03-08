import { useState } from "react";
import { User, Camera, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImageViewDialog } from "./ImageViewDialog";
import { useAuth } from "@/contexts/AuthContext";

interface ProfilePictureProps {
  userId: string;
  avatarUrl: string | null;
  onUpdate: (url: string) => void;
}

const compressImage = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          'image/jpeg',
          0.7
        );
      };
    };
    reader.onerror = (error) => reject(error);
  });
};

export const ProfilePicture = ({ userId, avatarUrl, onUpdate }: ProfilePictureProps) => {
  const [uploading, setUploading] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDeleteAvatar = async () => {
    if (!user || !avatarUrl) return;
    
    try {
      setIsDeleting(true);
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("avatars")
        .remove([`${userId}/avatar.jpg`]);
      
      if (storageError) {
        throw storageError;
      }

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: null,
          updated_at: new Date().toISOString()
        })
        .eq("id", userId);

      if (updateError) {
        throw updateError;
      }

      onUpdate("");
      toast({
        title: "Success",
        description: "Profile picture removed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove profile picture",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUploadClick = () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to update your profile picture",
        variant: "destructive",
      });
      return;
    }
    document.getElementById('avatar-upload')?.click();
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      console.log("Starting upload process...");

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      console.log("Selected file:", file.name, "Size:", file.size, "Type:", file.type);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error("Please upload an image file.");
      }

      console.log("Compressing image...");
      // Compress image
      const compressedImage = await compressImage(file);
      console.log("Compressed size:", compressedImage.size);
      
      // Validate compressed size (max 1MB)
      if (compressedImage.size > 1 * 1024 * 1024) {
        throw new Error("Image size should be less than 1MB after compression.");
      }

      const fileExt = 'jpg';
      const filePath = `${userId}/avatar.${fileExt}`;
      console.log("File path:", filePath);

      // Delete existing avatar if any
      console.log("Attempting to delete old avatar...");
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .remove([`${userId}/avatar.${fileExt}`]);
        
        if (error) {
          console.log("Error deleting old avatar:", error.message);
        } else {
          console.log("Old avatar deleted successfully");
        }
      } catch (error) {
        console.log('No existing avatar to delete');
      }

      // Upload new avatar
      console.log("Uploading new avatar...");
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, compressedImage, { 
          upsert: true,
          contentType: 'image/jpeg'
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      console.log("Upload successful:", uploadData);

      // Get public URL
      console.log("Getting public URL...");
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error("Failed to get public URL");
      }

      console.log("Public URL:", urlData.publicUrl);

      // Update profile with new avatar URL
      console.log("Updating profile with new avatar URL...");
      const { data: updateData, error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: urlData.publicUrl,
          updated_at: new Date().toISOString()
        } as any)
        .eq("id", userId)
        .select()
        .single();

      if (updateError) {
        console.error("Profile update error:", updateError);
        throw updateError;
      }

      console.log("Profile updated successfully:", updateData);
      onUpdate(urlData.publicUrl);
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
      
      // Clear the file input
      event.target.value = '';
      
    } catch (error: any) {
      console.error("Error in uploadAvatar:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative w-20 h-20 group">
      <div
        className={`w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden cursor-pointer ${uploading || isDeleting ? 'opacity-50' : ''}`}
        onClick={() => avatarUrl && setIsViewDialogOpen(true)}
      >
        {avatarUrl ? (
          <>
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity" />
          </>
        ) : (
          <User className="w-10 h-10 text-gray-400" />
        )}
        {(uploading || isDeleting) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      <div className="absolute -bottom-1 right-0 flex gap-2">
        {avatarUrl && (
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full w-8 h-8 transition-all hover:scale-110 shadow-md bg-destructive hover:bg-destructive/90 opacity-0 group-hover:opacity-90"
            disabled={uploading || isDeleting}
            onClick={handleDeleteAvatar}
            title="Remove Profile Picture"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 text-white" />
            )}
          </Button>
        )}
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full w-8 h-8 transition-all hover:scale-110 shadow-md bg-primary hover:bg-primary/90 opacity-90"
          disabled={uploading || isDeleting}
          onClick={handleUploadClick}
          title="Upload Profile Picture"
        >
          {uploading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera className="h-4 w-4 text-white" />
          )}
        </Button>
      </div>
      <input
        type="file"
        id="avatar-upload"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
        className="hidden"
      />
      <ImageViewDialog 
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        imageUrl={avatarUrl}
      />
    </div>
  );
};