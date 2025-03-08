import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useFriendRequestsQuery = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["friend-requests", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("friend_requests")
        .select(`
          *,
          sender:profiles!friend_requests_sender_id_fkey(
            id,
            first_name,
            last_name,
            avatar_url,
            profession
          )
        `)
        .eq("receiver_id", user?.id)
        .eq("status", "pending");

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};