import { useFriendsQuery } from "./useFriendsQuery";
import { useFriendRequestsQuery } from "./useFriendRequestsQuery";
import { useSentRequestsQuery } from "./useSentRequestsQuery";
import { useAllUsersQuery } from "./useAllUsersQuery";

export const useNetworkQueries = () => {
  const { data: friends } = useFriendsQuery();
  const { data: friendRequests } = useFriendRequestsQuery();
  const { data: sentRequests } = useSentRequestsQuery();
  const { data: allUsers } = useAllUsersQuery(friends);

  return {
    friends,
    friendRequests,
    sentRequests,
    allUsers,
  };
};