import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Gulf countries emergency contact data
const GULF_COUNTRIES = [
  {
    name: "UAE (Dubai)",
    description: "Consulate General of India in Dubai: toll-free helpline, chargeable number, Women/Housemaids distress line",
    phoneNumbers: ["800-46342 (800 INDIA, toll-free)", "00971504559594 (chargeable)", "02-4492700 Ext. 260", "0502103813"]
  },
  {
    name: "UAE (Abu Dhabi)",
    description: "Helpline numbers for Indian community",
    phoneNumbers: ["00-971-1-4492700", "8004632 (800 India, toll-free)"]
  },
  {
    name: "Saudi Arabia (Riyadh)",
    description: "Embassy of India, Riyadh: 24x7 Helpline Pravasi Bhartiya Seva Kendra (PBSK), WhatsApp, toll-free",
    phoneNumbers: ["00-966-11-4884697", "00-966-542126748 (WhatsApp)", "800 247 1234 (toll-free)"]
  },
  {
    name: "Kuwait",
    description: "Embassy of India in Kuwait: emergency contact",
    phoneNumbers: ["+965-22562151"]
  },
  {
    name: "Bahrain",
    description: "Indian Embassy in Bahrain",
    phoneNumbers: ["00-973-17714209", "00-973-17180529"]
  },
  {
    name: "Qatar",
    description: "Embassy of India in Doha",
    phoneNumbers: ["00-974-44255708"]
  }
];

interface ProfileFormProps {
  formData: {
    first_name: string;
    last_name: string;
    profession: string;
    location: string;
    languages: string[];
    emergency_contact_1: string;
    emergency_contact_2: string;
    emergency_contact_3: string;
    emergency_contact_4: string;
    emergency_contact_5: string;
    emergency_contact_5_country: string;
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
            <SelectValue placeholder="Select Profession" />
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
        <Label htmlFor="languages">Languages</Label>
        <Select
          value={formData.languages[0]}
          onValueChange={(value) => handleInputChange("languages", [value])}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Select Language" />
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

      {/* Emergency Contacts Section */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-semibold">Emergency Contacts</h3>
        
        <div className="space-y-2">
          <Label htmlFor="emergency_contact_1">
            Emergency Contact 1 (Immediate Family In India) *
          </Label>
          <Input
            id="emergency_contact_1"
            value={formData.emergency_contact_1}
            onChange={(e) => handleInputChange("emergency_contact_1", e.target.value)}
            placeholder="Enter phone number with Country Code"
          />
          <p className="text-xs text-muted-foreground">
            Required for SOS functionality - this person will be notified in case of emergency
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergency_contact_2">
            Emergency Contact 2 (Family/Friend in India)
          </Label>
          <Input
            id="emergency_contact_2"
            value={formData.emergency_contact_2}
            onChange={(e) => handleInputChange("emergency_contact_2", e.target.value)}
            placeholder="Enter phone number with Country Code (optional)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergency_contact_3">
            Emergency Contact 3 (Family/Friend in Gulf country)
          </Label>
          <Input
            id="emergency_contact_3"
            value={formData.emergency_contact_3}
            onChange={(e) => handleInputChange("emergency_contact_3", e.target.value)}
            placeholder="Enter phone number with Country Code (optional)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergency_contact_4">
            Emergency Contact 4 (Family/Friend in Gulf country)
          </Label>
          <Input
            id="emergency_contact_4"
            value={formData.emergency_contact_4}
            onChange={(e) => handleInputChange("emergency_contact_4", e.target.value)}
            placeholder="Enter phone number with Country Code (optional)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergency_contact_5_country">
            Emergency Contact 5 (Gulf Country Emergency Number)
          </Label>
          <Select 
            value={formData.emergency_contact_5_country} 
            onValueChange={(value) => {
              handleInputChange("emergency_contact_5_country", value);
              const selectedCountry = GULF_COUNTRIES.find(country => country.name === value);
              if (selectedCountry) {
                handleInputChange("emergency_contact_5", selectedCountry.phoneNumbers[0]);
              }
            }}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select Gulf country" />
            </SelectTrigger>
            <SelectContent
              className="bg-white shadow-lg z-[9999]"
              position="popper"
              sideOffset={5}
            >
              {GULF_COUNTRIES.map((country) => (
                <SelectItem key={country.name} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.emergency_contact_5_country && (
            <div className="mt-2 p-3 bg-muted rounded-md">
              <p className="text-sm font-medium mb-1">
                {GULF_COUNTRIES.find(c => c.name === formData.emergency_contact_5_country)?.description}
              </p>
              <p className="text-sm text-muted-foreground">
                Available numbers: {GULF_COUNTRIES.find(c => c.name === formData.emergency_contact_5_country)?.phoneNumbers.join(", ")}
              </p>
              <Input
                id="emergency_contact_5"
                value={formData.emergency_contact_5}
                onChange={(e) => handleInputChange("emergency_contact_5", e.target.value)}
                placeholder="Emergency contact number"
                className="mt-2"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
