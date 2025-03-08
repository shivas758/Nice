import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useNetworkMutations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addFriendRequestMutation = useMutation({
    mutationFn: async (friendId: string) => {
      console.log('Checking existing friend request for:', { user: user?.id, friend: friendId });
      
      const { data: existingRequest, error: checkError } = await supabase
        .from("friend_requests")
        .select("*")
        .eq("sender_id", user?.id)
        .eq("receiver_id", friendId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing request:', checkError);
        throw checkError;
      }

      if (existingRequest) {
        console.log('Found existing request:', existingRequest);
        throw new Error("Friend request already sent");
      }

      console.log('No existing request found, sending new request');
      const { error } = await supabase
        .from("friend_requests")
        .insert({ sender_id: user?.id, receiver_id: friendId });

      if (error) {
        console.error('Error sending friend request:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sent-requests"] });
      toast({
        title: "Success",
        description: "Friend request sent successfully!",
      });
    },
    onError: (error: Error) => {
      console.error("Error sending friend request:", error);
      toast({
        title: "Error",
        description: error.message === "Friend request already sent" 
          ? "You have already sent a friend request to this user"
          : "Failed to send friend request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFriendRequestMutation = useMutation({
    mutationFn: async ({ requestId, status, senderId }: { requestId: string; status: string; senderId: string }) => {
      console.log('Handling friend request:', { requestId, status, senderId });
      
      const { error: updateError } = await supabase
        .from("friend_requests")
        .update({ status })
        .eq("id", requestId);

      if (updateError) {
        console.error('Error updating friend request:', updateError);
        throw updateError;
      }

      if (status === "accepted") {
        console.log('Creating friendship records for:', { user: user?.id, friend: senderId });
        
        const { error: friendError } = await supabase
          .from("friends")
          .insert([
            { user_id: user?.id, friend_id: senderId },
            { user_id: senderId, friend_id: user?.id }
          ]);

        if (friendError) {
          console.error('Error creating friendship:', friendError);
          throw friendError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
      toast({
        title: "Success",
        description: "Friend request handled successfully!",
      });
    },
    onError: (error: any) => {
      console.error("Error handling friend request:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to handle friend request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const unfriendMutation = useMutation({
    mutationFn: async (friendId: string) => {
      console.log('Unfriending user:', friendId);
      
      // First delete where current user is user_id
      const { error: error1 } = await supabase
        .from("friends")
        .delete()
        .eq("user_id", user?.id)
        .eq("friend_id", friendId);

      if (error1) {
        console.error('Error deleting first friendship record:', error1);
        throw error1;
      }

      // Then delete where current user is friend_id
      const { error: error2 } = await supabase
        .from("friends")
        .delete()
        .eq("user_id", friendId)
        .eq("friend_id", user?.id);

      if (error2) {
        console.error('Error deleting second friendship record:', error2);
        throw error2;
      }
      
      console.log('Friendship records deleted successfully');
    },
    onSuccess: (_, friendId) => {
      queryClient.invalidateQueries({ queryKey: ["friends", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["friends", friendId] });
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
      
      toast({
        title: "Success",
        description: "Friend removed successfully!",
      });
    },
    onError: (error: any) => {
      console.error("Error removing friend:", error);
      toast({
        title: "Error",
        description: "Failed to remove friend. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    addFriendRequestMutation,
    handleFriendRequestMutation,
    unfriendMutation,
  };
};