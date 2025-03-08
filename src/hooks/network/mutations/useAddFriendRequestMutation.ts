import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAddFriendRequestMutation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friendId: string) => {
      if (!user?.id) {
        console.error('No user ID found');
        throw new Error('User not authenticated');
      }

      console.log('Checking existing friend request for:', { user: user.id, friend: friendId });
      
      const { data: existingRequest, error: checkError } = await supabase
        .from("friend_requests")
        .select("*")
        .eq("sender_id", user.id)
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
      const { data, error } = await supabase
        .from("friend_requests")
        .insert({ 
          sender_id: user.id, 
          receiver_id: friendId,
          status: 'pending' 
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending friend request:', error);
        throw error;
      }

      return data;
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
};