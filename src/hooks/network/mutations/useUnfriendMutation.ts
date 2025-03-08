import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useUnfriendMutation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friendId: string) => {
      if (!user?.id) {
        console.error('No user ID found');
        throw new Error('User not authenticated');
      }

      console.log('Starting unfriend operation:', { 
        currentUser: user?.id, 
        friendToRemove: friendId 
      });

      // Delete the friendship record where either:
      // 1. user_id is the smaller ID and friend_id is the larger ID
      // 2. friend_id is the smaller ID and user_id is the larger ID
      const { data: deletedFriendship, error: deleteError } = await supabase
        .from("friends")
        .delete()
        .or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`)
        .select();

      console.log('Deletion result:', { deletedFriendship, deleteError });

      if (deleteError) {
        console.error('Error deleting friendship:', deleteError);
        throw deleteError;
      }

      console.log('Unfriend operation completed successfully');
      return deletedFriendship;
    },
    onSuccess: (data, friendId) => {
      console.log('Mutation succeeded, invalidating queries:', data);
      queryClient.invalidateQueries({ queryKey: ["friends"] });
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
        description: error.message || "Failed to remove friend. Please try again.",
        variant: "destructive",
      });
    },
  });
};