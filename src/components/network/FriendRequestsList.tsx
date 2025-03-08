import { FriendRequestCard } from "./FriendRequestCard";

interface FriendRequestsListProps {
  friendRequests: any[];
  onAccept: (requestId: string, senderId: string) => void;
  onReject: (requestId: string, senderId: string) => void;
}

export const FriendRequestsList = ({ 
  friendRequests,
  onAccept,
  onReject,
}: FriendRequestsListProps) => {
  if (!friendRequests?.length) return null;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">Friend Requests</h2>
      {friendRequests.map((request) => (
        <FriendRequestCard
          key={request.id}
          profile={request.sender}
          onAccept={() => onAccept(request.id, request.sender_id)}
          onReject={() => onReject(request.id, request.sender_id)}
        />
      ))}
    </div>
  );
};