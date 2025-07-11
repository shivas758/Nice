import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    bio: "",
    // education_level: "",
    school: "",
    undergraduate_college: "",
    postgraduate_college: "",
    display_name: "",
    date_of_birth: "",
    gcc_address1: "",
    gcc_address2: "",
    gcc_city: "",
    gcc_country: "",
    gcc_postal_code: "",
    india_address1: "",
    india_address2: "",
    india_address3: "",
    india_city: "",
    india_state: "",
    india_country: "",
    india_pin_code: "",
    gcc_phone: "",
    india_phone: "",
    is_married: false,
    number_of_children: 0,
    emergency_contact_1: "",
    emergency_contact_2: "",
    emergency_contact_3: "",
    emergency_contact_4: "",
    emergency_contact_5: "",
    emergency_contact_5_country: "",
  });

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

  const handleInputChange = (name: string, value: string | boolean | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.bio  || !formData.display_name || 
          !formData.date_of_birth ||
          !formData.gcc_address1 || !formData.gcc_city || !formData.gcc_country || !formData.gcc_postal_code ||
          !formData.india_address1 || !formData.india_city || !formData.india_state || !formData.india_country || !formData.india_pin_code ||
          !formData.gcc_phone || !formData.india_phone || formData.is_married === undefined ||
          !formData.emergency_contact_1) {
        toast({
          title: "Error",
          description: "Please fill in all mandatory fields including Emergency Contact 1",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          ...formData,
          gcc_address: `${formData.gcc_address1}, ${formData.gcc_address2}, ${formData.gcc_city}, ${formData.gcc_country}, ${formData.gcc_postal_code}`,
          india_address: `${formData.india_address1}, ${formData.india_address2}, ${formData.india_address3}, ${formData.india_city}, ${formData.india_state}, ${formData.india_country}, ${formData.india_pin_code}`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session?.user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile completed successfully!",
      });

      navigate('/home');
    } catch (error: any) {
      console.error("Error completing profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Complete Your Profile</h1>
          <p className="text-sm text-muted-foreground">
          Update your profile to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pb-16">
          <div className="space-y-4">
            <div>
              <Label htmlFor="display_name">Display Name *</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => handleInputChange("display_name", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio *</Label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                required
                className="border p-2 rounded w-full min-h-[80px]"
                placeholder="Please enter 2-3 sentences about your job title, working location, where from in India, etc. For example: My name is Lakshman Reddy. I'm working as a project manager in Dubai for the last 7 years. I'm looking forward to connecting with others in the Gulf countries to learn and help"
              />
            </div>

            <div>
              <Label htmlFor="date_of_birth">Date of Birth *</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="school">School Name</Label>
              <Input
                id="school"
                value={formData.school}
                onChange={(e) => handleInputChange("school", e.target.value)}
                 placeholder="St. Joseph's High School, Warangal"

              />
            </div>

            <div>
              <Label htmlFor="undergraduate_college">Undergraduate College</Label>
              <Input
                id="undergraduate_college"
                value={formData.undergraduate_college}
                onChange={(e) => handleInputChange("undergraduate_college", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="postgraduate_college">Postgraduate College</Label>
              <Input
                id="postgraduate_college"
                value={formData.postgraduate_college}
                onChange={(e) => handleInputChange("postgraduate_college", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="gcc_address1">Gulf Address *</Label>
              <Input
                id="gcc_address1"
                value={formData.gcc_address1}
                onChange={(e) => handleInputChange("gcc_address1", e.target.value)}
                required
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
                required
                placeholder="City (e.g., Dubai)"
                className="mt-2"
              />
              <Input
                id="gcc_country"
                value={formData.gcc_country}
                onChange={(e) => handleInputChange("gcc_country", e.target.value)}
                required
                placeholder="Country (e.g., United Arab Emirates)"
                className="mt-2"
              />
              <Input
                id="gcc_postal_code"
                value={formData.gcc_postal_code}
                onChange={(e) => handleInputChange("gcc_postal_code", e.target.value)}
                required
                placeholder="Postal Code (e.g., 12345)"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">Please enter your full Gulf address. Accurate address is critical for our services.</p>
            </div>

            <div>
              <Label htmlFor="india_address1">India Address *</Label>
              <Input
                id="india_address1"
                value={formData.india_address1}
                onChange={(e) => handleInputChange("india_address1", e.target.value)}
                required
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
                required
                placeholder="City (e.g., Warangal)"
                className="mt-2"
              />
              <Input
                id="india_state"
                value={formData.india_state}
                onChange={(e) => handleInputChange("india_state", e.target.value)}
                required
                placeholder="State (e.g., Telangana)"
                className="mt-2"
              />
              <Input
                id="india_country"
                value={formData.india_country}
                onChange={(e) => handleInputChange("india_country", e.target.value)}
                required
                placeholder="Country (e.g., India)"
                className="mt-2"
              />
              <Input
                id="india_pin_code"
                value={formData.india_pin_code}
                onChange={(e) => handleInputChange("india_pin_code", e.target.value)}
                required
                placeholder="Pin Code (e.g., 506001)"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">Please enter your full Indian address for verification and communication.</p>
            </div>

            <div>
              <Label htmlFor="gcc_phone">Gulf Phone# *</Label>
              <Input
                id="gcc_phone"
                value={formData.gcc_phone}
                onChange={(e) => handleInputChange("gcc_phone", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="india_phone">India Phone# *</Label>
              <Input
                id="india_phone"
                value={formData.india_phone}
                onChange={(e) => handleInputChange("india_phone", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="is_married">Marital Status *</Label>
              <Select 
                value={formData.is_married ? "married" : "single"} 
                onValueChange={(value) => handleInputChange("is_married", value === "married")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.is_married && (
              <div>
                <Label htmlFor="number_of_children">Number of Children</Label>
                <Input
                  id="number_of_children"
                  type="number"
                  min="0"
                  max="4"
                  value={formData.number_of_children}
                  onChange={(e) => handleInputChange("number_of_children", parseInt(e.target.value) || 0)}
                />
              </div>
            )}

            {/* Emergency Contacts Section */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold">Emergency Contacts</h3>
              
              <div>
                <Label htmlFor="emergency_contact_1">
                  Emergency Contact 1 (Immediate Family In India) *
                </Label>
                <Input
                  id="emergency_contact_1"
                  value={formData.emergency_contact_1}
                  onChange={(e) => handleInputChange("emergency_contact_1", e.target.value)}
                  required
                  placeholder="Enter phone number with Country Code"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Required for SOS functionality - this person will be notified in case of emergency
                </p>
              </div>

              <div>
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

              <div>
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

              <div>
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

              <div>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gulf country" />
                  </SelectTrigger>
                  <SelectContent>
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

          <div className="flex justify-end">
            <Button type="submit" className="w-full md:w-auto">
              Complete Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
