import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, UserPlus, Check } from 'lucide-react';
import { UserProfile } from '@/components/network/UserProfile';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Messages } from '@/components/messages/Messages';
import { useState } from 'react';
import { useNetworkMutations } from '@/hooks/network/useNetworkMutations';

interface UserProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: any;
}

export const UserProfileDialog = ({ isOpen, onOpenChange, selectedUser }: UserProfileDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isMessageSheetOpen, setIsMessageSheetOpen] = useState(false);
  const { addFriendRequestMutation, handleFriendRequestMutation } = useNetworkMutations();

  // Check if users are friends
  const { data: areFriends } = useQuery({
    queryKey: ['are-friends', user?.id, selectedUser?.id],
    queryFn: async () => {
      console.log('Checking friendship status between:', user?.id, 'and', selectedUser?.id);
      
      if (!user?.id || !selectedUser?.id) return false;

      const { data, error } = await supabase
        .from('friends')
        .select('*')
        .or(`and(user_id.eq.${user.id},friend_id.eq.${selectedUser.id}),and(user_id.eq.${selectedUser.id},friend_id.eq.${user.id})`)
        .maybeSingle();

      if (error) {
        console.error('Error checking friendship status:', error);
        return false;
      }

      console.log('Friendship check result:', data);
      return !!data;
    },
    enabled: !!user?.id && !!selectedUser?.id,
  });

  // Check if a friend request is pending
  const { data: pendingRequest } = useQuery({
    queryKey: ['pending-request', user?.id, selectedUser?.id],
    queryFn: async () => {
      console.log('Checking pending request between:', user?.id, 'and', selectedUser?.id);
      
      if (!user?.id || !selectedUser?.id) return null;

      const { data, error } = await supabase
        .from('friend_requests')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${user.id})`)
        .eq('status', 'pending')
        .maybeSingle();

      if (error) {
        console.error('Error checking pending request:', error);
        return null;
      }

      console.log('Pending request check result:', data);
      return data;
    },
    enabled: !!user?.id && !!selectedUser?.id,
  });

  const handleMessage = () => {
    if (!selectedUser) return;
    setIsMessageSheetOpen(true);
  };

  const handleAddFriend = () => {
    if (!selectedUser?.id) return;
    addFriendRequestMutation.mutate(selectedUser.id);
  };

  const handleFriendRequest = (status: 'accepted' | 'rejected') => {
    if (!pendingRequest?.id || !selectedUser?.id) return;
    handleFriendRequestMutation.mutate({
      requestId: pendingRequest.id,
      status,
      senderId: selectedUser.id,
    });
  };

  if (!selectedUser) return null;

  const isCurrentUser = user?.id === selectedUser.id;
  const showAddFriendButton = !areFriends && !pendingRequest && !isCurrentUser;
  const showAcceptRejectButtons = pendingRequest?.receiver_id === user?.id;
  const showRequestPending = pendingRequest?.sender_id === user?.id;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <div className="space-y-4">
            <UserProfile profile={selectedUser} />
            <div className="flex justify-end space-x-2 pt-4 border-t">
              {areFriends && (
                <Button
                  onClick={handleMessage}
                  className="flex items-center"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
              )}
              {showAddFriendButton && (
                <Button
                  onClick={handleAddFriend}
                  className="flex items-center"
                  disabled={addFriendRequestMutation.isPending}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Friend
                </Button>
              )}
              {showRequestPending && (
                <Button disabled className="flex items-center">
                  <Check className="w-4 h-4 mr-2" />
                  Request Pending
                </Button>
              )}
              {showAcceptRejectButtons && (
                <>
                  <Button
                    onClick={() => handleFriendRequest('accepted')}
                    className="flex items-center"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleFriendRequest('rejected')}
                    variant="outline"
                    className="flex items-center"
                  >
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Sheet open={isMessageSheetOpen} onOpenChange={setIsMessageSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] p-0">
          <SheetHeader className="px-4 py-2">
            <SheetTitle>Messages</SheetTitle>
          </SheetHeader>
          {selectedUser && (
            <Messages
              recipientId={selectedUser.id}
              recipientName={`${selectedUser.first_name} ${selectedUser.last_name}`}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};