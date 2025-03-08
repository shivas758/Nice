import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  content: string;
  created_at: string;
  message_request_status: string;
  sender: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

interface GroupedMessage {
  sender: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  messages: Message[];
  latestMessage: Message;
}

interface MessageInboxProps {
  onMessageSelect: (userId: string, userName: string) => void;
}

export const MessageInbox = ({ onMessageSelect }: MessageInboxProps) => {
  const { user } = useAuth();
  const [groupedMessages, setGroupedMessages] = useState<GroupedMessage[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          id,
          content,
          created_at,
          message_request_status,
          sender:profiles!messages_sender_id_fkey (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq("receiver_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      // Group messages by sender
      const grouped = data.reduce((acc: { [key: string]: GroupedMessage }, message: Message) => {
        const senderId = message.sender.id;
        if (!acc[senderId]) {
          acc[senderId] = {
            sender: message.sender,
            messages: [],
            latestMessage: message
          };
        }
        acc[senderId].messages.push(message);
        if (new Date(message.created_at) > new Date(acc[senderId].latestMessage.created_at)) {
          acc[senderId].latestMessage = message;
        }
        return acc;
      }, {});

      setGroupedMessages(Object.values(grouped));
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE)
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${user?.id}`,
        },
        (payload) => {
          console.log("New message received:", payload);
          fetchMessages(); // Refresh messages when new one arrives or status updates
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return (
    <div className="h-[600px] flex flex-col">
      <div className="border-b p-4">
        <h2 className="text-xl font-semibold">Message Inbox</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {groupedMessages.map((group) => (
            <div
              key={group.sender.id}
              className="flex items-start space-x-4 border-b pb-4 cursor-pointer hover:bg-gray-50"
              onClick={() => onMessageSelect(
                group.sender.id,
                `${group.sender.first_name} ${group.sender.last_name}`
              )}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={group.sender.avatar_url || ''} alt={`${group.sender.first_name} ${group.sender.last_name}`} />
                <AvatarFallback>
                  {`${group.sender.first_name[0]}${group.sender.last_name[0]}`}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">
                    {group.sender.first_name} {group.sender.last_name}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {format(new Date(group.latestMessage.created_at), "MMM d, yyyy HH:mm")}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{group.latestMessage.content}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-500">
                    {group.messages.length} message{group.messages.length !== 1 ? 's' : ''}
                  </span>
                  {group.latestMessage.message_request_status === "pending" && (
                    <span className="text-sm text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">
                      Message request
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};