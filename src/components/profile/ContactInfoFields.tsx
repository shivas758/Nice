import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactInfoFieldsProps {
  formData: {
    gcc_address1: string;
    gcc_address2: string;
    gcc_city: string;
    gcc_country: string;
    gcc_postal_code: string;
    india_address1: string;
    india_address2: string;
    india_address3: string;
    india_city: string;
    india_state: string;
    india_country: string;
    india_pin_code: string;
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
        <Label>GCC Address</Label>
        <Input
          id="gcc_address1"
          value={formData.gcc_address1}
          onChange={(e) => handleInputChange("gcc_address1", e.target.value)}
          placeholder="Address 1 (e.g., Flat 12B, Al Noor Building)"
        />
        <Input
          id="gcc_address2"
          value={formData.gcc_address2}
          onChange={(e) => handleInputChange("gcc_address2", e.target.value)}
          placeholder="Address 2 (optional)"
          className="mt-2"
        />
        <Input
          id="gcc_city"
          value={formData.gcc_city}
          onChange={(e) => handleInputChange("gcc_city", e.target.value)}
          placeholder="City (e.g., Dubai)"
          className="mt-2"
        />
        <Input
          id="gcc_country"
          value={formData.gcc_country}
          onChange={(e) => handleInputChange("gcc_country", e.target.value)}
          placeholder="Country (e.g., United Arab Emirates)"
          className="mt-2"
        />
        <Input
          id="gcc_postal_code"
          value={formData.gcc_postal_code}
          onChange={(e) => handleInputChange("gcc_postal_code", e.target.value)}
          placeholder="Postal Code (e.g., 12345)"
          className="mt-2"
        />
      </div>

      <div className="space-y-2 mt-4">
        <Label>India Address</Label>
        <Input
          id="india_address1"
          value={formData.india_address1}
          onChange={(e) => handleInputChange("india_address1", e.target.value)}
          placeholder="Address 1 (e.g., H.No. 1-2-345, Gandhi Nagar)"
        />
        <Input
          id="india_address2"
          value={formData.india_address2}
          onChange={(e) => handleInputChange("india_address2", e.target.value)}
          placeholder="Address 2 (optional)"
          className="mt-2"
        />
        <Input
          id="india_address3"
          value={formData.india_address3}
          onChange={(e) => handleInputChange("india_address3", e.target.value)}
          placeholder="Address 3 (optional)"
          className="mt-2"
        />
        <Input
          id="india_city"
          value={formData.india_city}
          onChange={(e) => handleInputChange("india_city", e.target.value)}
          placeholder="City (e.g., Warangal)"
          className="mt-2"
        />
        <Input
          id="india_state"
          value={formData.india_state}
          onChange={(e) => handleInputChange("india_state", e.target.value)}
          placeholder="State (e.g., Telangana)"
          className="mt-2"
        />
        <Input
          id="india_country"
          value={formData.india_country}
          onChange={(e) => handleInputChange("india_country", e.target.value)}
          placeholder="Country (e.g., India)"
          className="mt-2"
        />
        <Input
          id="india_pin_code"
          value={formData.india_pin_code}
          onChange={(e) => handleInputChange("india_pin_code", e.target.value)}
          placeholder="Pin Code (e.g., 506001)"
          className="mt-2"
        />
      </div>

      <div className="space-y-2 mt-4">
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
