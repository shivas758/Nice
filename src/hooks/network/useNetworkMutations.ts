import { useAddFriendRequestMutation } from "./mutations/useAddFriendRequestMutation";
import { useHandleFriendRequestMutation } from "./mutations/useHandleFriendRequestMutation";
import { useUnfriendMutation } from "./mutations/useUnfriendMutation";

export const useNetworkMutations = () => {
  // Initialize mutations
  const addFriendRequestMutation = useAddFriendRequestMutation();
  const handleFriendRequestMutation = useHandleFriendRequestMutation();
  const unfriendMutation = useUnfriendMutation();

  return {
    addFriendRequestMutation,
    handleFriendRequestMutation,
    unfriendMutation,
  };
};