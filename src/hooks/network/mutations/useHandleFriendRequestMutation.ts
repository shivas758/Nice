import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FriendRequestPayload } from "../types";

export const useHandleFriendRequestMutation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, status, senderId }: FriendRequestPayload) => {
      if (!user?.id) {
        console.error('No user ID found');
        throw new Error('User not authenticated');
      }

      console.log('Handling friend request:', { requestId, status, senderId });
      
      // First update the status
      const { error: updateError } = await supabase
        .from("friend_requests")
        .update({ status })
        .eq("id", requestId);

      if (updateError) {
        console.error('Error updating friend request:', updateError);
        throw updateError;
      }

      if (status === "accepted") {
        console.log('Creating friendship record for:', { user: user.id, friend: senderId });
        
        // Determine which ID should be user_id (smaller) and which should be friend_id (larger)
        const [smallerId, largerId] = [user.id, senderId].sort();
        
        const { error: friendError } = await supabase
          .from("friends")
          .insert({
            user_id: smallerId,
            friend_id: largerId
          });

        if (friendError) {
          console.error('Error creating friendship:', friendError);
          throw friendError;
        }
      }

      // After handling the request (whether accepted or rejected), delete it
      console.log('Deleting handled friend request:', requestId);
      const { error: deleteError } = await supabase
        .from("friend_requests")
        .delete()
        .eq("id", requestId);

      if (deleteError) {
        console.error('Error deleting friend request:', deleteError);
        throw deleteError;
      }

      console.log('Friend request handled and deleted successfully');
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
};