import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, MapPin, Book, X, MessageCircle, UserPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const handleFriendRequest = () => {
    toast({
      title: "Friend Request Sent",
      description: "Your friend request has been sent successfully!",
    });
  };

  const handleMessage = () => {
    toast({
      title: "Coming Soon",
      description: "Messaging feature will be available soon!",
    });
  };

  return (
    <div className="p-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate("/")}
        className="mb-4"
      >
        <X className="h-6 w-6" />
      </Button>

      <Card className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {profile?.first_name} {profile?.last_name}
            </h2>
            <p className="text-gray-600">{profile?.profession}</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            <span>{profile?.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Book className="w-5 h-5 text-gray-500" />
            <span>Languages: {profile?.languages?.join(", ")}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            className="flex-1"
            onClick={handleFriendRequest}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Friend Request
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleMessage}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;