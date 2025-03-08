import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useBlockedUsersQuery = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["blocked-users", user?.id],
    queryFn: async () => {
      console.log('Fetching blocked users for:', user?.id);
      
      const { data: blockedUsers, error } = await supabase
        .from("blocked_users")
        .select(`
          blocked_id,
          blocked_profile:profiles!blocked_users_blocked_id_fkey(*)
        `)
        .eq('blocker_id', user?.id);

      if (error) {
        console.error('Error fetching blocked users:', error);
        throw error;
      }

      console.log('Fetched blocked users:', blockedUsers);
      return blockedUsers.map(bu => bu.blocked_profile);
    },
    enabled: !!user?.id,
  });
};