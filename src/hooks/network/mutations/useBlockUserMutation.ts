import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useBlockUserMutation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, isBlocking }: { userId: string; isBlocking: boolean }) => {
      console.log(`${isBlocking ? 'Blocking' : 'Unblocking'} user:`, userId);
      
      if (isBlocking) {
        // First unfriend the user if they are friends
        const { error: unfriendError } = await supabase
          .from("friends")
          .delete()
          .or(`and(user_id.eq.${user?.id},friend_id.eq.${userId}),and(user_id.eq.${userId},friend_id.eq.${user?.id})`);

        if (unfriendError) {
          console.error('Error unfriending user:', unfriendError);
          throw unfriendError;
        }

        // Then block the user
        const { error: blockError } = await supabase
          .from("blocked_users")
          .insert({ blocker_id: user?.id, blocked_id: userId });

        if (blockError) {
          console.error('Error blocking user:', blockError);
          throw blockError;
        }
      } else {
        // Unblock the user
        const { error: unblockError } = await supabase
          .from("blocked_users")
          .delete()
          .eq('blocker_id', user?.id)
          .eq('blocked_id', userId);

        if (unblockError) {
          console.error('Error unblocking user:', unblockError);
          throw unblockError;
        }
      }
    },
    onSuccess: (_, { isBlocking }) => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["blocked-users"] });
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
      
      toast({
        title: "Success",
        description: `User ${isBlocking ? 'blocked' : 'unblocked'} successfully!`,
      });
    },
    onError: (error: any) => {
      console.error("Error managing block status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to manage block status. Please try again.",
        variant: "destructive",
      });
    },
  });
};