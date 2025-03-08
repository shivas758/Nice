import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ViewableProfilePicture } from "@/components/profile/ViewableProfilePicture";

interface UserProfileProps {
  profile: any;
}

export const UserProfile = ({ profile }: UserProfileProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return format(new Date(dateString), "dd MMM yyyy");
  };

  return (
    <ScrollArea className="h-[60vh] pr-4">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <ViewableProfilePicture
            avatarUrl={profile.avatar_url}
            size="lg"
          />
          <div>
            <h2 className="text-xl font-semibold">
              {profile.first_name} {profile.last_name}
            </h2>
            <p className="text-gray-600">{profile.display_name || profile.first_name}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Basic Information</h3>
            <div className="space-y-2">
              <p><strong>Location:</strong> {profile.location || 'Not specified'}</p>
              <p><strong>Languages:</strong> {profile.languages?.join(', ') || 'Not specified'}</p>
              <p><strong>Profession:</strong> {profile.profession || 'Not specified'}</p>
              <p><strong>Date of Birth:</strong> {formatDate(profile.date_of_birth)}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Contact Information</h3>
            <div className="space-y-2">
              <p><strong>GCC Address:</strong> {profile.gcc_address || 'Not specified'}</p>
              <p><strong>India Address:</strong> {profile.india_address || 'Not specified'}</p>
              <p><strong>GCC Phone:</strong> {profile.gcc_phone || 'Not specified'}</p>
              <p><strong>India Phone:</strong> {profile.india_phone || 'Not specified'}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Education</h3>
            <div className="space-y-2">
              <p><strong>Education Level:</strong> {profile.education_level || 'Not specified'}</p>
              {profile.school && <p><strong>School:</strong> {profile.school}</p>}
              {profile.undergraduate_college && <p><strong>Undergraduate College:</strong> {profile.undergraduate_college}</p>}
              {profile.postgraduate_college && <p><strong>Postgraduate College:</strong> {profile.postgraduate_college}</p>}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Personal Details</h3>
            <div className="space-y-2">
              <p><strong>Marital Status:</strong> {profile.is_married ? 'Married' : 'Single'}</p>
              {profile.is_married && (
                <>
                  <p><strong>Number of Children:</strong> {profile.number_of_children}</p>
                  {profile.number_of_children > 0 && (
                    <div className="pl-4">
                      {profile.child_1_name && (
                        <p>Child 1: {profile.child_1_name} ({formatDate(profile.child_1_dob)})</p>
                      )}
                      {profile.child_2_name && (
                        <p>Child 2: {profile.child_2_name} ({formatDate(profile.child_2_dob)})</p>
                      )}
                      {profile.child_3_name && (
                        <p>Child 3: {profile.child_3_name} ({formatDate(profile.child_3_dob)})</p>
                      )}
                      {profile.child_4_name && (
                        <p>Child 4: {profile.child_4_name} ({formatDate(profile.child_4_dob)})</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {profile.bio && (
            <div>
              <h3 className="font-semibold mb-2">Bio</h3>
              <p className="text-gray-600">{profile.bio}</p>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};
