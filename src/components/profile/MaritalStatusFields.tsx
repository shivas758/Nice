import { Label } from "@/components/ui/label";

interface MaritalStatusFieldsProps {
  formData: {
    is_married: boolean;
  };
  handleInputChange: (name: string, value: boolean) => void;
}

export const MaritalStatusFields = ({
  formData,
  handleInputChange,
}: MaritalStatusFieldsProps) => {
  return (
    <div className="space-y-2">
      <Label>Marital Status</Label>
      <div className="flex items-center space-x-4">
        <Label className="flex items-center space-x-2">
          <input
            type="radio"
            checked={formData.is_married}
            onChange={() => handleInputChange("is_married", true)}
            className="h-4 w-4"
          />
          <span>Married</span>
        </Label>
        <Label className="flex items-center space-x-2">
          <input
            type="radio"
            checked={!formData.is_married}
            onChange={() => handleInputChange("is_married", false)}
            className="h-4 w-4"
          />
          <span>Single</span>
        </Label>
      </div>
    </div>
  );
};