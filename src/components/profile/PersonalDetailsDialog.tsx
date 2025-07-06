import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ClipboardList } from "lucide-react";
import { BasicInfoFields } from "./BasicInfoFields";
import { ContactInfoFields } from "./ContactInfoFields";
import { MaritalStatusFields } from "./MaritalStatusFields";
import { ChildrenFormFields } from "./ChildrenFormFields";

interface PersonalDetailsDialogProps {
  profile: any;
  onUpdate: () => void;
  isFirstLogin?: boolean;
  children?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Add Gulf countries emergency contact data
const GULF_COUNTRIES = [
  {
    name: "UAE (Dubai)",
    phoneNumbers: ["800-46342 (800 INDIA, toll-free)", "00971504559594 (chargeable)", "02-4492700 Ext. 260", "0502103813"]
  },
  {
    name: "UAE (Abu Dhabi)",
    phoneNumbers: ["00-971-1-4492700", "8004632 (800 India, toll-free)"]
  },
  {
    name: "Saudi Arabia (Riyadh)",
    phoneNumbers: ["00-966-11-4884697", "00-966-542126748 (WhatsApp)", "800 247 1234 (toll-free)"]
  },
  {
    name: "Kuwait",
    phoneNumbers: ["+965-22562151"]
  },
  {
    name: "Bahrain",
    phoneNumbers: ["00-973-17714209", "00-973-17180529"]
  },
  {
    name: "Qatar",
    phoneNumbers: ["00-974-44255708"]
  }
];

export const PersonalDetailsDialog = ({ profile, onUpdate, isFirstLogin = false, children, isOpen: externalIsOpen, onOpenChange }: PersonalDetailsDialogProps) => {
  console.log("Profile prop in PersonalDetailsDialog:", profile);
  const [internalIsOpen, setInternalIsOpen] = useState(isFirstLogin);
  const { toast } = useToast();
  
  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;
  const [formData, setFormData] = useState({
    bio: profile?.bio || "",
    education_level: profile?.education_level || "",
    school: profile?.school || "",
    undergraduate_college: profile?.undergraduate_college || "",
    postgraduate_college: profile?.postgraduate_college || "",
    display_name: profile?.display_name || "",
    date_of_birth: profile?.date_of_birth || "",
    // Gulf Address fields
    gcc_address1: profile?.gcc_address1 || "",
    gcc_address2: profile?.gcc_address2 || "",
    gcc_city: profile?.gcc_city || "",
    gcc_country: profile?.gcc_country || "",
    gcc_postal_code: profile?.gcc_postal_code || "",
    // India Address fields
    india_address1: profile?.india_address1 || "",
    india_address2: profile?.india_address2 || "",
    india_address3: profile?.india_address3 || "",
    india_city: profile?.india_city || "",
    india_state: profile?.india_state || "",
    india_country: profile?.india_country || "",
    india_pin_code: profile?.india_pin_code || "",
    gcc_phone: profile?.gcc_phone || "",
    india_phone: profile?.india_phone || "",
    is_married: profile?.is_married || false,
    number_of_children: profile?.number_of_children || 0,
    child_1_name: profile?.child_1_name || "",
    child_1_dob: profile?.child_1_dob || "",
    child_2_name: profile?.child_2_name || "",
    child_2_dob: profile?.child_2_dob || "",
    child_3_name: profile?.child_3_name || "",
    child_3_dob: profile?.child_3_dob || "",
    child_4_name: profile?.child_4_name || "",
    child_4_dob: profile?.child_4_dob || "",
    emergency_contact_1: profile?.emergency_contact_1 || "",
    emergency_contact_2: profile?.emergency_contact_2 || "",
    emergency_contact_3: profile?.emergency_contact_3 || "",
    emergency_contact_4: profile?.emergency_contact_4 || "",
    emergency_contact_5: profile?.emergency_contact_5 || "",
    emergency_contact_5_country: profile?.emergency_contact_5_country || "",
  });

  useEffect(() => {
    setFormData({
      bio: profile?.bio || "",
      education_level: profile?.education_level || "",
      school: profile?.school || "",
      undergraduate_college: profile?.undergraduate_college || "",
      postgraduate_college: profile?.postgraduate_college || "",
      display_name: profile?.display_name || "",
      date_of_birth: profile?.date_of_birth || "",
      // Gulf Address fields
      gcc_address1: profile?.gcc_address1 || "",
      gcc_address2: profile?.gcc_address2 || "",
      gcc_city: profile?.gcc_city || "",
      gcc_country: profile?.gcc_country || "",
      gcc_postal_code: profile?.gcc_postal_code || "",
      // India Address fields
      india_address1: profile?.india_address1 || "",
      india_address2: profile?.india_address2 || "",
      india_address3: profile?.india_address3 || "",
      india_city: profile?.india_city || "",
      india_state: profile?.india_state || "",
      india_country: profile?.india_country || "",
      india_pin_code: profile?.india_pin_code || "",
      gcc_phone: profile?.gcc_phone || "",
      india_phone: profile?.india_phone || "",
      is_married: profile?.is_married || false,
      number_of_children: profile?.number_of_children || 0,
      child_1_name: profile?.child_1_name || "",
      child_1_dob: profile?.child_1_dob || "",
      child_2_name: profile?.child_2_name || "",
      child_2_dob: profile?.child_2_dob || "",
      child_3_name: profile?.child_3_name || "",
      child_3_dob: profile?.child_3_dob || "",
      child_4_name: profile?.child_4_name || "",
      child_4_dob: profile?.child_4_dob || "",
      emergency_contact_1: profile?.emergency_contact_1 || "",
      emergency_contact_2: profile?.emergency_contact_2 || "",
      emergency_contact_3: profile?.emergency_contact_3 || "",
      emergency_contact_4: profile?.emergency_contact_4 || "",
      emergency_contact_5: profile?.emergency_contact_5 || "",
      emergency_contact_5_country: profile?.emergency_contact_5_country || "",
    });
  }, [profile]);

  const handleInputChange = (name: string, value: string | boolean | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...formData,
          date_of_birth: formData.date_of_birth || null,
          child_1_dob: formData.child_1_dob || null,
          child_2_dob: formData.child_2_dob || null,
          child_3_dob: formData.child_3_dob || null,
          child_4_dob: formData.child_4_dob || null,
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Personal details updated successfully!",
      });
      
      setIsOpen(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating personal details:", error);
      toast({
        title: "Error",
        description: "Failed to update personal details. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!isFirstLogin) {
          setIsOpen(open);
        }
      }}
    >
      {!isFirstLogin && children && !externalIsOpen && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Personal Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <BasicInfoFields formData={formData} handleInputChange={handleInputChange} />
          <ContactInfoFields formData={formData} handleInputChange={handleInputChange} />
          <MaritalStatusFields formData={formData} handleInputChange={handleInputChange} />
          {formData.is_married && (
            <ChildrenFormFields formData={formData} handleInputChange={handleInputChange} />
          )}
          {/* Emergency Contacts Section */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Emergency Contacts</h3>
            <div>
              <label htmlFor="emergency_contact_1">Emergency Contact 1 (Immediate Family In India) *</label>
              <input
                id="emergency_contact_1"
                className="w-full border rounded p-2"
                value={formData.emergency_contact_1}
                onChange={e => handleInputChange("emergency_contact_1", e.target.value)}
                placeholder="Enter phone number with Country Code with Country Code"
              />
            </div>
            <div>
              <label htmlFor="emergency_contact_2">Emergency Contact 2 (Family/Friend in India)</label>
              <input
                id="emergency_contact_2"
                className="w-full border rounded p-2"
                value={formData.emergency_contact_2}
                onChange={e => handleInputChange("emergency_contact_2", e.target.value)}
                placeholder="Enter phone number with Country Code (optional)"
              />
            </div>
            <div>
              <label htmlFor="emergency_contact_3">Emergency Contact 3 (Family/Friend in Gulf country)</label>
              <input
                id="emergency_contact_3"
                className="w-full border rounded p-2"
                value={formData.emergency_contact_3}
                onChange={e => handleInputChange("emergency_contact_3", e.target.value)}
                placeholder="Enter phone number with Country Code (optional)"
              />
            </div>
            <div>
              <label htmlFor="emergency_contact_4">Emergency Contact 4 (Family/Friend in Gulf country)</label>
              <input
                id="emergency_contact_4"
                className="w-full border rounded p-2"
                value={formData.emergency_contact_4}
                onChange={e => handleInputChange("emergency_contact_4", e.target.value)}
                placeholder="Enter phone number with Country Code (optional)"
              />
            </div>
            <div>
              <label htmlFor="emergency_contact_5_country">Emergency Contact 5 (Gulf Country Emergency Number)</label>
              <select
                id="emergency_contact_5_country"
                className="w-full border rounded p-2"
                value={formData.emergency_contact_5_country}
                onChange={e => {
                  const value = e.target.value;
                  handleInputChange("emergency_contact_5_country", value);
                  const selectedCountry = GULF_COUNTRIES.find(c => c.name === value);
                  if (selectedCountry) {
                    handleInputChange("emergency_contact_5", selectedCountry.phoneNumbers[0]);
                  } else {
                    handleInputChange("emergency_contact_5", "");
                  }
                }}
              >
                <option value="">Select Gulf country</option>
                {GULF_COUNTRIES.map(country => (
                  <option key={country.name} value={country.name}>{country.name}</option>
                ))}
              </select>
              <input
                id="emergency_contact_5"
                className="w-full border rounded p-2 mt-2"
                value={formData.emergency_contact_5}
                onChange={e => handleInputChange("emergency_contact_5", e.target.value)}
                placeholder="Emergency contact number"
              />
            </div>
          </div>
        </div>
        <Button onClick={handleSubmit} className="w-full">
          Save Changes
        </Button>
      </DialogContent>
    </Dialog>
  );
};
