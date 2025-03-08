import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useAllUsersQuery = (friends: any[] | undefined) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      console.log('Fetching all users');
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user?.id);

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      console.log('Fetched users:', data);
      
      if (friends) {
        const friendIds = friends.map(friend => friend.id);
        return data.filter(profile => !friendIds.includes(profile.id));
      }
      
      return data;
    },
    enabled: !!user?.id,
  });
};