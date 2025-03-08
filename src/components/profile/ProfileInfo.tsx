import { Mail, MapPin, Languages, Cake, Heart, Users, Briefcase, BookOpen, Home } from "lucide-react";
import { ProfilePicture } from "./ProfilePicture";
import { Card } from "@/components/ui/card";
import { InfoItem } from "./InfoItem";
import { PhoneInfo } from "./PhoneInfo";
import { BioSection } from "./BioSection";
import { EducationSection } from "./EducationSection";
import { AddressSection } from "./AddressSection";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface ProfileInfoProps {
  profile: any;
  setIsEditProfileOpen: (value: boolean) => void;
  setIsEditing?: (value: boolean) => void;
  isLoading?: boolean;
  onProfileUpdate: () => void;
}

export const ProfileInfo = ({ profile, setIsEditProfileOpen, setIsEditing, isLoading = false, onProfileUpdate }: ProfileInfoProps) => {
  const { user } = useAuth();
  const userEmail = user?.email;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return format(new Date(dateString), "MMMM dd, yyyy");
  };

  if (isLoading) {
    return (
      <Card className="p-6 mb-4 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse" />
            <div className="space-y-3">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-4 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <ProfilePicture
              userId={profile?.id || ''}
              avatarUrl={profile?.avatar_url || null}
              onUpdate={onProfileUpdate}
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">
              {profile?.display_name || (profile ? `${profile.first_name || ''} ${profile.last_name || ''}` : 'Loading...')}
            </h2>
            <p className="text-gray-600 flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                {profile?.profession || 'Loading...'}
              </span>
              {profile?.location && (
                <span className="flex items-center gap-1 text-gray-500">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {profile?.bio && (
        <>
          <BioSection bio={profile.bio} />
          <div className="my-6 border-t border-gray-200" />
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
          <div className="space-y-3">
            <InfoItem icon={Mail} text={userEmail} />
            {(profile?.gcc_phone || profile?.india_phone) && (
              <PhoneInfo gcc_phone={profile?.gcc_phone} india_phone={profile?.india_phone} />
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
          <div className="space-y-3">
            <InfoItem icon={Languages} text={`Languages: ${profile?.languages?.join(", ")}`} />
            {profile?.date_of_birth && (
              <InfoItem icon={Cake} text={`Birth Date: ${formatDate(profile?.date_of_birth)}`} />
            )}
            <InfoItem 
              icon={Heart} 
              text={`Marital Status: ${profile?.is_married ? "Married" : "Single"}`} 
            />
            {profile?.is_married && (
              <InfoItem 
                icon={Users} 
                text={`Number of Children: ${profile?.number_of_children || 0}`} 
              />
            )}
          </div>
        </div>
      </div>

      {/* Education Section */}
      {(profile?.education_level || profile?.school_1) && (
        <>
          <div className="my-6 border-t border-gray-200" />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Education
            </h3>
            <EducationSection 
              educationLevel={profile.education_level}
              schools={[profile.school_1, profile.school_2, profile.school_3]}
            />
          </div>
        </>
      )}

      {/* Address Section */}
      {(profile?.gcc_address || profile?.india_address) && (
        <>
          <div className="my-6 border-t border-gray-200" />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Home className="h-5 w-5" />
              Addresses
            </h3>
            <AddressSection 
              gccAddress={profile.gcc_address}
              indiaAddress={profile.india_address}
            />
          </div>
        </>
      )}
    </Card>
  );
};
