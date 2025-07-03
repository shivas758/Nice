import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProfileFormProps {
  formData: {
    first_name: string;
    last_name: string;
    profession: string;
    location: string;
    languages: string[];
  };
  handleInputChange: (name: string, value: string | string[]) => void;
  professions: Array<{ id: number; name: string }>;
  locations: Array<{ id: number; name: string }>;
  languages: Array<{ id: number; name: string }>;
  profile: any;
}

export const ProfileForm = ({
  formData,
  handleInputChange,
  professions,
  locations,
  languages,
  profile,
}: ProfileFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="first_name">First Name</Label>
        <Input
          id="first_name"
          value={formData.first_name}
          onChange={(e) => handleInputChange("first_name", e.target.value)}
          placeholder="Enter your first name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="last_name">Last Name</Label>
        <Input
          id="last_name"
          value={formData.last_name}
          onChange={(e) => handleInputChange("last_name", e.target.value)}
          placeholder="Enter your last name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="profession">Profession</Label>
        <Select
          value={formData.profession}
          onValueChange={(value) => handleInputChange("profession", value)}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Select profession" />
          </SelectTrigger>
          <SelectContent
            className="bg-white shadow-lg z-[9999]"
            position="popper"
            sideOffset={5}
          >
            {professions?.map((profession) => (
              <SelectItem key={profession.id} value={profession.name}>
                {profession.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Select
          value={formData.location}
          onValueChange={(value) => handleInputChange("location", value)}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent
            className="bg-white shadow-lg z-[9999]"
            position="popper"
            sideOffset={5}
          >
            {locations?.map((location) => (
              <SelectItem key={location.id} value={location.name}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="languages">Languages</Label>
        <Select
          value={formData.languages[0]}
          onValueChange={(value) => handleInputChange("languages", [value])}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent
            className="bg-white shadow-lg z-[9999]"
            position="popper"
            sideOffset={5}
          >
            {languages?.map((language) => (
              <SelectItem key={language.id} value={language.name}>
                {language.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
