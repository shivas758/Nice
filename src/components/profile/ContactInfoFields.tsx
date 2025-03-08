import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactInfoFieldsProps {
  formData: {
    gcc_address: string;
    india_address: string;
    gcc_phone: string;
    india_phone: string;
  };
  handleInputChange: (name: string, value: string) => void;
}

export const ContactInfoFields = ({
  formData,
  handleInputChange,
}: ContactInfoFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="gcc_address">GCC Address</Label>
        <Input
          id="gcc_address"
          value={formData.gcc_address}
          onChange={(e) => handleInputChange("gcc_address", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="india_address">India Address</Label>
        <Input
          id="india_address"
          value={formData.india_address}
          onChange={(e) => handleInputChange("india_address", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gcc_phone">GCC Phone</Label>
        <Input
          id="gcc_phone"
          value={formData.gcc_phone}
          onChange={(e) => handleInputChange("gcc_phone", e.target.value)}
          placeholder="+971 XX XXX XXXX"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="india_phone">India Phone</Label>
        <Input
          id="india_phone"
          value={formData.india_phone}
          onChange={(e) => handleInputChange("india_phone", e.target.value)}
          placeholder="+91 XXXXX XXXXX"
        />
      </div>
    </>
  );
};