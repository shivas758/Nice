import { UserCard } from "./UserCard";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UsersListProps {
  users: any[];
  showAddFriend?: boolean;
  onMessage: (id: string, name: string) => void;
  onAddFriend?: (id: string) => void;
  onUnfriend?: (id: string) => void;
  onBlock?: (id: string) => void;
  onUnblock?: (id: string) => void;
  getRequestStatus?: (profileId: string) => string | null;
  onProfileClick: (profile: any) => void;
  isBlocked?: (userId: string) => boolean;
}

export const UsersList = ({
  users,
  showAddFriend = false,
  onMessage,
  onAddFriend,
  onUnfriend,
  onBlock,
  onUnblock,
  getRequestStatus,
  onProfileClick,
  isBlocked,
}: UsersListProps) => {
  const { user } = useAuth();

  // Query to get users who have blocked the current user
  const { data: blockedByUsers = [] } = useQuery({
    queryKey: ["blocked-by-users", user?.id],
    queryFn: async () => {
      console.log('Fetching users who blocked current user:', user?.id);
      const { data, error } = await supabase
        .from("blocked_users")
        .select("blocker_id")
        .eq("blocked_id", user?.id);

      if (error) {
        console.error('Error fetching blocked-by users:', error);
        throw error;
      }

      console.log('Users who blocked current user:', data);
      return data.map(block => block.blocker_id);
    },
    enabled: !!user?.id,
  });

  // Query to get incoming friend requests
  const { data: incomingRequests = [] } = useQuery({
    queryKey: ["incoming-requests", user?.id],
    queryFn: async () => {
      console.log('Fetching incoming friend requests for user:', user?.id);
      const { data, error } = await supabase
        .from("friend_requests")
        .select("sender_id, status")
        .eq("receiver_id", user?.id)
        .eq("status", "pending");

      if (error) {
        console.error('Error fetching incoming requests:', error);
        throw error;
      }

      console.log('Incoming friend requests:', data);
      return data;
    },
    enabled: !!user?.id,
  });

  // Filter out users who have blocked the current user
  const filteredUsers = users.filter(profile => !blockedByUsers.includes(profile.id));

  // Check both sent and received requests
  const getFullRequestStatus = (profileId: string) => {
    // First check sent requests using the existing getRequestStatus function
    const sentStatus = getRequestStatus?.(profileId);
    if (sentStatus) return sentStatus;

    // Then check incoming requests
    const hasIncomingRequest = incomingRequests.some(
      request => request.sender_id === profileId && request.status === "pending"
    );
    return hasIncomingRequest ? "pending" : null;
  };

  if (!filteredUsers?.length) return <div className="text-gray-500">No users found</div>;

  return (
    <div className="space-y-4">
      {filteredUsers.map((profile) => (
        <div key={profile.id}>
          <UserCard
            profile={profile}
            showAddFriend={showAddFriend}
            onMessage={onMessage}
            onAddFriend={onAddFriend}
            onUnfriend={onUnfriend}
            onBlock={onBlock}
            onUnblock={onUnblock}
            isBlocked={isBlocked?.(profile.id)}
            requestStatus={getFullRequestStatus(profile.id)}
            onProfileClick={onProfileClick}
          />
        </div>
      ))}
    </div>
  );
};