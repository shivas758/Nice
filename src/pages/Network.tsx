import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageInbox } from "@/components/network/MessageInbox";
import { UserProfile } from "@/components/network/UserProfile";
import { Messages } from "@/components/messages/Messages";
import { FriendRequestsList } from "@/components/network/FriendRequestsList";
import { UsersList } from "@/components/network/UsersList";
import { useNetworkQueries } from "@/hooks/network/useNetworkQueries";
import { useNetworkMutations } from "@/hooks/network/useNetworkMutations";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useBlockUserMutation } from "@/hooks/network/mutations/useBlockUserMutation";
import { useBlockedUsersQuery } from "@/hooks/network/useBlockedUsersQuery";
import { Label } from "@/components/ui/label";
import { SearchInput } from "@/components/network/SearchInput";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Network = () => {
  const [showAllUsers, setShowAllUsers] = useState<boolean | null>(null);
  const [showInbox, setShowInbox] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [selectedChat, setSelectedChat] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isMessageSheetOpen, setIsMessageSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"profession" | "language">("profession");
  const { toast } = useToast();

  const { friends, friendRequests, sentRequests, allUsers } = useNetworkQueries();
  const { addFriendRequestMutation, handleFriendRequestMutation, unfriendMutation } = useNetworkMutations();
  const { mutate: blockUser } = useBlockUserMutation();
  const { data: blockedUsers } = useBlockedUsersQuery();

  const { data: professions = [] } = useQuery({
    queryKey: ["professions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("professions").select("*").order("name");
      if (error) throw error;
      return data as unknown as Array<{ id: number; name: string }>;
    },
  });

  const { data: languages = [] } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("languages").select("*").order("name");
      if (error) throw error;
      return data as unknown as Array<{ id: number; name: string }>;
    },
  });

  useEffect(() => {
    if (friends && showAllUsers === null) {
      setShowAllUsers(friends.length === 0);
    }
  }, [friends, showAllUsers]);

  const filterUsers = (users: any[]) => {
    if (!activeSearchQuery) {
      if (showAllUsers) {
        return (allUsers || []).filter(user => !(friends || []).some(friend => friend.id === user.id));
      }
      return users;
    }
    
    let filteredResults = users;
    if (showAllUsers) {
      filteredResults = (allUsers || []).filter(user => !(friends || []).some(friend => friend.id === user.id));
    }

    return filteredResults.filter(user => {
      if (searchType === "profession") {
        return user.profession?.toLowerCase().includes(activeSearchQuery.toLowerCase());
      } else {
        return user.languages?.some((lang: string) => lang.toLowerCase().includes(activeSearchQuery.toLowerCase()));
      }
    });
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setActiveSearchQuery(value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveSearchQuery("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e.currentTarget.value);
    }
  };

  const handleMessage = (profileId: string, profileName: string) => {
    setSelectedChat({ id: profileId, name: profileName });
    setIsMessageSheetOpen(true);
  };

  const handleProfileClick = (profile: any) => {
    setSelectedProfile(profile);
  };

  const getRequestStatus = (profileId: string) => {
    if (!sentRequests) return null;
    const request = sentRequests.find(r => {
      if (typeof r === 'object' && r !== null && 'receiver_id' in r && 'status' in r) {
        return r.receiver_id === profileId;
      }
      return false;
    });
    return request && typeof request === 'object' && 'status' in request ? request.status : null;
  };

  const handleBlock = (userId: string) => blockUser({ userId, isBlocking: true });
  const handleUnblock = (userId: string) => blockUser({ userId, isBlocking: false });
  const isUserBlocked = (userId: string) => blockedUsers?.some(bu => bu.id === userId) || false;
  const filteredUsers = filterUsers(showAllUsers ? allUsers || [] : friends || []);

  return (
    <div className="p-2 sm:p-4 pb-20">
      <div className="sticky top-0 bg-white z-10 -mx-2 sm:mx-0 px-2 sm:px-0 pb-4 border-b">
        <div className="flex justify-between items-center gap-2 mb-2">
          <h1 className="text-xl sm:text-2xl font-bold">My Network</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setShowInbox(!showInbox);
                setSelectedProfile(null);
              }}
              variant={showInbox ? "default" : "outline"}
              className="text-sm"
              size="sm"
            >
              {showInbox ? "Network" : "Inbox"}
            </Button>
            {!showInbox && (
              <Button
                onClick={() => setShowAllUsers(!showAllUsers)}
                variant={showAllUsers ? "default" : "outline"}
                className="text-sm"
                size="sm"
              >
                {showAllUsers ? "Friends" : "Add Friends"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {!showInbox && (
        <div className="mt-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="searchType">Search by</Label>
                <Select
                  value={searchType}
                  onValueChange={(value: "profession" | "language") => {
                    setSearchType(value);
                    setSearchQuery("");
                    setActiveSearchQuery("");
                  }}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select search type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profession">Profession</SelectItem>
                    <SelectItem value="language">Language</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="search">Select {searchType === "profession" ? "Profession" : "Language"}</Label>
                <div className="relative">
                  <SearchInput
                    value={searchQuery}
                    onChange={handleSearch}
                    onSearch={() => {}}
                    onClear={handleClearSearch}
                    type={searchType}
                    suggestions={searchType === "profession" ? professions : languages}
                    onKeyPress={handleKeyPress}
                  />
                </div>
              </div>
            </div>
          </div>
          {activeSearchQuery && (
            <div className="mt-2 text-sm text-gray-600">
              Showing results for: {activeSearchQuery}
              {filteredUsers.length > 0 && (
                <span className="ml-2">
                  ({filteredUsers.length} {filteredUsers.length === 1 ? 'result' : 'results'} found)
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {showInbox ? (
        <MessageInbox onMessageSelect={handleMessage} />
      ) : (
        <div className="space-y-4">
          {!showAllUsers && (
            <FriendRequestsList
              friendRequests={friendRequests || []}
              onAccept={(requestId, senderId) => 
                handleFriendRequestMutation.mutate({
                  requestId,
                  status: "accepted",
                  senderId
                })
              }
              onReject={(requestId, senderId) =>
                handleFriendRequestMutation.mutate({
                  requestId,
                  status: "rejected",
                  senderId
                })
              }
            />
          )}
          
          {!showAllUsers && filteredUsers.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                Right now, you have no friends to show, search for people to friend using add friends button.
              </p>
            </div>
          ) : (
            <UsersList
              users={filteredUsers}
              showAddFriend={showAllUsers}
              onMessage={handleMessage}
              onAddFriend={(id) => addFriendRequestMutation.mutate(id)}
              onUnfriend={(id) => unfriendMutation.mutate(id)}
              onBlock={handleBlock}
              onUnblock={handleUnblock}
              getRequestStatus={showAllUsers ? getRequestStatus : undefined}
              onProfileClick={handleProfileClick}
              isBlocked={isUserBlocked}
            />
          )}
        </div>
      )}

      <Dialog 
        open={!!selectedProfile} 
        onOpenChange={(open) => !open && setSelectedProfile(null)}
      >
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Profile Details</DialogTitle>
          </DialogHeader>
          {selectedProfile && <UserProfile profile={selectedProfile} />}
        </DialogContent>
      </Dialog>

      <Sheet open={isMessageSheetOpen} onOpenChange={setIsMessageSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] p-0" onClick={(e) => e.stopPropagation()}>
          <SheetHeader className="px-4 py-2">
            <SheetTitle>Messages</SheetTitle>
          </SheetHeader>
          {selectedChat && (
            <Messages
              recipientId={selectedChat.id}
              recipientName={selectedChat.name}
              onClose={() => setIsMessageSheetOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Network;
