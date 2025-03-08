import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Building2,
  Stethoscope,
  Scale,
  Home,
  Languages,
} from "lucide-react";

const Resources = () => {
  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6">Resources</h1>
      
      <div className="grid gap-4">
        <Card className="p-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <GraduationCap className="text-primary" />
            Education
          </h2>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              Schools & Universities
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Language Courses
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Professional Certifications
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <Building2 className="text-primary" />
            Employment
          </h2>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              Job Listings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Resume Writing
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Career Counseling
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <Stethoscope className="text-primary" />
            Healthcare
          </h2>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              Medical Services
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Mental Health
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Insurance Information
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <Scale className="text-primary" />
            Legal
          </h2>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              Immigration Law
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Workers' Rights
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Legal Aid Services
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <Home className="text-primary" />
            Housing
          </h2>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              Rental Assistance
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Housing Rights
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Temporary Shelters
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <Languages className="text-primary" />
            Language & Culture
          </h2>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              Language Exchange
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Cultural Events
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Community Groups
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Resources;