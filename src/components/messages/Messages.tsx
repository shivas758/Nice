import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { MessageHeader } from "./MessageHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Message } from "@/types/supabase";

interface MessagesProps {
  recipientId: string;
  recipientName: string;
  onClose?: () => void;
}

export const Messages = ({ recipientId, recipientName, onClose }: MessagesProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [recipientAvatar, setRecipientAvatar] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipientProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', recipientId)
        .single();

      if (!error && data) {
        setRecipientAvatar(data.avatar_url);
      }
    };

    fetchRecipientProfile();
  }, [recipientId]);

  useEffect(() => {
    const fetchMessages = async () => {
      console.log("Fetching messages between", user?.id, "and", recipientId);
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey (
            id,
            first_name,
            last_name,
            avatar_url
          ),
          receiver:profiles!messages_receiver_id_fkey (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .or(
          `and(sender_id.eq.${user?.id},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${user?.id})`
        )
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      console.log("Fetched messages:", data);
      setMessages(data || []);
      
      if (data && data.length > 0) {
        setRequestStatus(data[data.length - 1].message_request_status);
      }
    };

    let channel: RealtimeChannel | null = null;

    const setupRealtime = async () => {
      await fetchMessages();

      channel = supabase
        .channel('public:messages')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages'
          },
          (payload: RealtimePostgresChangesPayload<Message>) => {
            console.log('Received real-time event:', payload);

            const newMessage = payload.new as Message;
            const isRelevantMessage = 
              (newMessage.sender_id === user?.id && newMessage.receiver_id === recipientId) ||
              (newMessage.sender_id === recipientId && newMessage.receiver_id === user?.id);

            if (!isRelevantMessage) {
              console.log('Ignoring message from different conversation');
              return;
            }

            if (payload.eventType === 'INSERT') {
              console.log('Adding new message:', newMessage);
              setMessages(current => {
                // Check if message with this ID already exists
                const messageExists = current.some(msg => msg.id === newMessage.id);
                if (messageExists) {
                  return current; // Don't add if it already exists
                }
                return [...current, newMessage];
              });
              setRequestStatus(newMessage.message_request_status);
            } else if (payload.eventType === 'UPDATE') {
              console.log('Updating message:', newMessage);
              setMessages(current =>
                current.map(msg => msg.id === newMessage.id ? newMessage : msg)
              );
              setRequestStatus(newMessage.message_request_status);
            }
          }
        )
        .subscribe(status => {
          console.log('Subscription status:', status);
        });
    };

    setupRealtime();

    return () => {
      if (channel) {
        console.log('Cleaning up subscription');
        supabase.removeChannel(channel);
      }
    };
  }, [user?.id, recipientId]);

  const handleMessageRequest = async (status: "accepted" | "rejected") => {
    const pendingMessages = messages.filter(
      (msg) => msg.message_request_status === "pending"
    );
    
    for (const msg of pendingMessages) {
      const { error } = await supabase
        .from("messages")
        .update({ message_request_status: status })
        .eq("id", msg.id);

      if (error) {
        console.error("Error updating message status:", error);
        toast({
          title: "Error",
          description: "Failed to update message request status",
          variant: "destructive",
        });
        return;
      }
    }

    toast({
      title: "Success",
      description: `Message request ${status}`,
    });
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      console.log("Sending message to:", recipientId);
      const { data, error } = await supabase
        .from("messages")
        .insert({
          sender_id: user?.id,
          receiver_id: recipientId,
          content: message.trim(),
          message_request_status: requestStatus === "accepted" ? "accepted" : "pending",
        })
        .select()
        .single();

      if (error) {
        console.error("Error sending message:", error);
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive"
        });
        return;
      }

      setMessages(prev => [...prev, data]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const isPending = requestStatus === "pending";
  const isRejected = requestStatus === "rejected";
  const canSendMessage = !isPending || messages.some(m => m.sender_id === user?.id);
  const isRecipient = messages.some(m => m.receiver_id === user?.id);

  return (
    <div className="flex flex-col h-screen sm:h-[600px] bg-background fixed inset-0 z-50">
      <MessageHeader
        recipientName={recipientName}
        recipientAvatar={recipientAvatar}
        isPending={isPending}
        isRecipient={isRecipient}
        onAccept={() => handleMessageRequest("accepted")}
        onDecline={() => handleMessageRequest("rejected")}
        onBack={onClose || (() => {})}
      />
      <MessageList
        messages={messages}
        currentUserId={user?.id || ""}
        isPending={isPending}
        isRejected={isRejected}
        isRecipient={isRecipient}
        recipientName={recipientName}
      />
      <div className="border-t p-3 sm:p-4 mt-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
        <MessageInput
          message={message}
          onChange={setMessage}
          onSend={sendMessage}
          disabled={!canSendMessage}
        />
      </div>
    </div>
  );
};
