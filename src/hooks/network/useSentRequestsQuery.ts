import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useSentRequestsQuery = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["sent-requests", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("friend_requests")
        .select("receiver_id, status")
        .eq("sender_id", user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};