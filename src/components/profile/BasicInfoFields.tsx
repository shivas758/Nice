import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BasicInfoFieldsProps {
  formData: {
    bio: string;
    education_level: string;
    school: string;
    undergraduate_college: string;
    postgraduate_college: string;
    display_name: string;
    date_of_birth: string;
  };
  handleInputChange: (name: string, value: string) => void;
}

export const BasicInfoFields = ({
  formData,
  handleInputChange,
}: BasicInfoFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="bio">Brief Bio (500 words max)</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => handleInputChange("bio", e.target.value)}
          maxLength={500}
          placeholder="Share a brief introduction about yourself..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="education_level">Education Level</Label>
        <Input
          id="education_level"
          value={formData.education_level}
          onChange={(e) => handleInputChange("education_level", e.target.value)}
          placeholder="e.g., Bachelor's Degree"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="school">School</Label>
        <Input
          id="school"
          value={formData.school}
          onChange={(e) => handleInputChange("school", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="undergraduate_college">Undergraduate College</Label>
        <Input
          id="undergraduate_college"
          value={formData.undergraduate_college}
          onChange={(e) => handleInputChange("undergraduate_college", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="postgraduate_college">Postgraduate College</Label>
        <Input
          id="postgraduate_college"
          value={formData.postgraduate_college}
          onChange={(e) => handleInputChange("postgraduate_college", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="display_name">Display Name</Label>
        <Input
          id="display_name"
          value={formData.display_name}
          onChange={(e) => handleInputChange("display_name", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date_of_birth">Date of Birth</Label>
        <Input
          id="date_of_birth"
          type="date"
          value={formData.date_of_birth}
          onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
        />
      </div>
    </>
  );
};
