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
        </div>
        <Button onClick={handleSubmit} className="w-full">
          Save Changes
        </Button>
      </DialogContent>
    </Dialog>
  );
};
