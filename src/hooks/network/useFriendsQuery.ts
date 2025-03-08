import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { FriendRecordPayload } from "./types";

export const useFriendsQuery = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Set up real-time subscription for friends table
  useEffect(() => {
    if (!user?.id) return;

    console.log('Setting up friends subscription for user:', user.id);

    const friendsSubscription = supabase
      .channel('friends-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friends',
          filter: `user_id=eq.${user.id} OR friend_id=eq.${user.id}`,
        },
        (payload: FriendRecordPayload) => {
          console.log('Friends table changed:', payload);
          // Type guard to ensure payload.new exists and has required properties
          if (payload.new && 'user_id' in payload.new && 'friend_id' in payload.new) {
            const otherUserId = payload.new.user_id === user.id 
              ? payload.new.friend_id 
              : payload.new.user_id;
            
            console.log('Invalidating queries for users:', user.id, otherUserId);
            
            queryClient.invalidateQueries({ queryKey: ["friends", user.id] });
            if (otherUserId) {
              queryClient.invalidateQueries({ queryKey: ["friends", otherUserId] });
            }
            queryClient.invalidateQueries({ queryKey: ["all-users"] });
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up friends subscription');
      friendsSubscription.unsubscribe();
    };
  }, [user?.id, queryClient]);

  return useQuery({
    queryKey: ["friends", user?.id],
    queryFn: async () => {
      console.log('Fetching friends for user:', user?.id);
      
      // Query for friendships where the user is either user_id or friend_id
      const { data: friendships, error } = await supabase
        .from("friends")
        .select(`
          user_id,
          friend_id,
          friend_profile:profiles!friends_friend_id_fkey(*),
          user_profile:profiles!friends_user_id_fkey(*)
        `)
        .or(`user_id.eq.${user?.id},friend_id.eq.${user?.id}`);

      if (error) {
        console.error('Error fetching friends:', error);
        throw error;
      }

      // Map the results to get the friend's profile, considering whether the user is user_id or friend_id
      const friends = friendships.map((f) => {
        // If the current user is user_id, return the friend's profile
        // If the current user is friend_id, return the user's profile
        return f.user_id === user?.id ? f.friend_profile : f.user_profile;
      });

      console.log('Fetched friends:', friends);
      return friends;
    },
    enabled: !!user?.id,
  });
};