import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    bio: "",
    education_level: "",
    school: "",
    undergraduate_college: "",
    postgraduate_college: "",
    display_name: "",
    date_of_birth: "",
    gcc_address: "",
    india_address: "",
    gcc_phone: "",
    india_phone: "",
    is_married: false,
    number_of_children: 0,
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
      if (!formData.bio || !formData.education_level || !formData.display_name || 
          !formData.date_of_birth || !formData.gcc_address || !formData.india_address || 
          !formData.gcc_phone || !formData.india_phone || formData.is_married === undefined) {
        toast({
          title: "Error",
          description: "Please fill in all mandatory fields",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          ...formData,
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
            Please fill in your profile details to continue
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
              <Input
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                required
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
              <Label htmlFor="education_level">Education Level *</Label>
              <Select 
                value={formData.education_level} 
                onValueChange={(value) => handleInputChange("education_level", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  {["10th", "12th", "undergraduate", "post graduate"].map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="school">School</Label>
              <Input
                id="school"
                value={formData.school}
                onChange={(e) => handleInputChange("school", e.target.value)}
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
              <Label htmlFor="gcc_address">GCC Address *</Label>
              <Input
                id="gcc_address"
                value={formData.gcc_address}
                onChange={(e) => handleInputChange("gcc_address", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="india_address">India Address *</Label>
              <Input
                id="india_address"
                value={formData.india_address}
                onChange={(e) => handleInputChange("india_address", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="gcc_phone">GCC Phone *</Label>
              <Input
                id="gcc_phone"
                value={formData.gcc_phone}
                onChange={(e) => handleInputChange("gcc_phone", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="india_phone">India Phone *</Label>
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
