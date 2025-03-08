import { Button } from "@/components/ui/button";
import { MapPin, Book, MessageCircle, UserPlus, UserMinus, Ban, Unlock, Loader2 } from "lucide-react";
import { ViewableProfilePicture } from "@/components/profile/ViewableProfilePicture";
import { format } from "date-fns";

interface UserCardProps {
  profile: any;
  showAddFriend?: boolean;
  onMessage: (id: string, name: string) => void;
  onAddFriend?: (id: string) => void;
  onUnfriend?: (id: string) => void;
  onBlock?: (id: string) => void;
  onUnblock?: (id: string) => void;
  isBlocked?: boolean;
  requestStatus?: string | null;
  onProfileClick: (profile: any) => void;
}

export const UserCard = ({ 
  profile, 
  showAddFriend = false, 
  onMessage, 
  onAddFriend,
  onUnfriend,
  onBlock,
  onUnblock,
  isBlocked,
  requestStatus,
  onProfileClick
}: UserCardProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return format(new Date(dateString), "dd MMM yyyy");
  };

  const renderActionButton = () => {
    if (isBlocked) {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="w-9 h-9 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onUnblock?.(profile.id);
          }}
        >
          <Unlock className="w-4 h-4" />
        </Button>
      );
    }

    if (showAddFriend) {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="w-9 h-9 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onAddFriend?.(profile.id);
          }}
          disabled={requestStatus === "pending"}
        >
          {requestStatus === "pending" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4" />
          )}
        </Button>
      );
    }

    return (
      <div className="grid grid-flow-col gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          className="w-9 h-9 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onUnfriend?.(profile.id);
          }}
        >
          <UserMinus className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-9 h-9 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onBlock?.(profile.id);
          }}
        >
          <Ban className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-4 border rounded-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="shrink-0">
            <ViewableProfilePicture
              avatarUrl={profile.avatar_url}
              size="md"
            />
          </div>
          <div className="min-w-0 flex-1">
            <button 
              className="text-left block focus:outline-none"
              onClick={() => onProfileClick(profile)}
            >
              <h3 className="font-semibold hover:text-primary hover:underline transition-colors">
                {profile.first_name} {profile.last_name}
              </h3>
            </button>
            <p className="text-sm text-gray-600">{profile.profession || 'No profession listed'}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{profile.location || 'No location listed'}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Book className="w-4 h-4" />
              <span>
                {profile.languages && profile.languages.length > 0
                  ? profile.languages.join(", ")
                  : 'No languages listed'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-1.5 shrink-0 items-start">
          {!isBlocked && (
            <Button
              variant="ghost"
              size="sm"
              className="w-9 h-9 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onMessage(profile.id, `${profile.first_name} ${profile.last_name}`);
              }}
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          )}
          {renderActionButton()}
        </div>
      </div>
    </div>
  );
};
