import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface AuthFormFieldsProps {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profession: string;
  language: string;
  maritalStatus: boolean;
  education: string;
  selectedCommunities: string[];
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onProfessionChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onMaritalStatusChange: (value: boolean) => void;
  onEducationChange: (value: string) => void;
  onCommunitiesChange: (value: string[]) => void;
  professions: Array<{ id: number; name: string }>;
  languages: Array<{ id: number; name: string }>;
  communities: Array<{ id: string; name: string }>;
  isSignUp: boolean;
}

export const AuthFormFields = ({
  email,
  password,
  firstName,
  lastName,
  profession,
  language,
  maritalStatus,
  education,
  selectedCommunities,
  onEmailChange,
  onPasswordChange,
  onFirstNameChange,
  onLastNameChange,
  onProfessionChange,
  onLanguageChange,
  onMaritalStatusChange,
  onEducationChange,
  onCommunitiesChange,
  professions,
  languages,
  communities,
  isSignUp,
}: AuthFormFieldsProps) => {
  const educationOptions = ["10th", "12th", "undergraduate", "post graduate"];

  const handleCommunityToggle = (communityId: string) => {
    const newSelectedCommunities = selectedCommunities.includes(communityId)
      ? selectedCommunities.filter(id => id !== communityId)
      : [...selectedCommunities, communityId];
    onCommunitiesChange(newSelectedCommunities);
  };

  return (
    <div className="space-y-4">
      {isSignUp && (
        <>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            required
            className="border p-2 rounded w-full"
          />
          <Select value={profession} onValueChange={onProfessionChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select profession" />
            </SelectTrigger>
            <SelectContent>
              {professions?.map((profession) => (
                <SelectItem key={profession.id} value={profession.name}>
                  {profession.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages?.map((language) => (
                <SelectItem key={language.id} value={language.name}>
                  {language.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={education} onValueChange={onEducationChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              {educationOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Communities</label>
            <div className="border p-2 rounded max-h-40 overflow-y-auto">
              {communities?.map((community) => (
                <div key={community.id} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={`community-${community.id}`}
                    checked={selectedCommunities.includes(community.id)}
                    onCheckedChange={() => handleCommunityToggle(community.id)}
                  />
                  <label htmlFor={`community-${community.id}`} className="text-sm">
                    {community.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
          className="border p-2 rounded w-full"
        />
      </div>
    </div>
  );
};
