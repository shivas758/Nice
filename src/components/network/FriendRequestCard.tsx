import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

interface FriendRequestCardProps {
  profile: any;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export const FriendRequestCard = ({ profile, onAccept, onReject }: FriendRequestCardProps) => {
  return (
    <div className="p-4 border rounded-lg mb-4">
      <div className="flex justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={profile.avatar_url || ''}
              alt={`${profile.first_name} ${profile.last_name}`}
            />
            <AvatarFallback>
              {`${profile.first_name[0]}${profile.last_name[0]}`}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">
              {profile.first_name} {profile.last_name}
            </h3>
            <p className="text-sm text-gray-600">{profile.profession || 'No profession listed'}</p>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="justify-start px-2 h-8 w-20"
            onClick={() => onAccept(profile.id)}
          >
            <Check className="w-4 h-4 mr-2" />
            Accept
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start px-2 h-8 w-20"
            onClick={() => onReject(profile.id)}
          >
            <X className="w-4 h-4 mr-2" />
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
};