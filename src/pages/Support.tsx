import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Globe, Mail, AlertCircle } from "lucide-react";

const Support = () => {
  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6">Support</h1>
      
      <div className="space-y-4">
        <Card className="p-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <AlertCircle className="text-red-500" />
            Emergency Contacts
          </h2>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Phone className="h-4 w-4" />
              Emergency: 911
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Phone className="h-4 w-4" />
              Police: 112
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-3">Helpful Resources</h2>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Globe className="h-4 w-4" />
              Immigration Services
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Globe className="h-4 w-4" />
              Legal Aid
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Globe className="h-4 w-4" />
              Healthcare Services
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-3">Contact Us</h2>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Mail className="h-4 w-4" />
              support@nice.com
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Phone className="h-4 w-4" />
              +1 234 567 8900
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Support;