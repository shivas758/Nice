import { ScrollArea } from "@/components/ui/scroll-area";
import { format, isToday, isYesterday } from "date-fns";
import { useEffect, useRef } from "react";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isPending: boolean;
  isRejected: boolean;
  isRecipient: boolean;
  recipientName: string;
}

const formatMessageTime = (date: Date) => {
  return format(date, 'HH:mm');
};

const formatMessageDate = (date: Date) => {
  if (isToday(date)) {
    return 'Today';
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  return format(date, 'MMMM d, yyyy');
};

export const MessageList = ({
  messages,
  currentUserId,
  isPending,
  isRejected,
  isRecipient,
  recipientName,
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderMessages = () => {
    let currentDate: string | null = null;
    
    return (
      <div className="flex flex-col space-y-3">
        {messages.map((message, index) => {
          const messageDate = new Date(message.created_at);
          const formattedTime = formatMessageTime(messageDate);
          let showDateSeparator = false;
          
          // Check if we need to show a date separator
          const messageDay = format(messageDate, 'yyyy-MM-dd');
          if (messageDay !== currentDate) {
            currentDate = messageDay;
            showDateSeparator = true;
          }

          const isCurrentUser = message.sender_id === currentUserId;

          return (
            <div key={message.id}>
              {showDateSeparator && (
                <div className="flex justify-center my-4">
                  <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                    {formatMessageDate(messageDate)}
                  </div>
                </div>
              )}
              <div
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}
              >
                <div
                  className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${
                    isCurrentUser ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`rounded-2xl px-3 sm:px-4 py-2 ${
                      isCurrentUser
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  </div>
                  <span
                    className={`text-xs mt-1 ${
                      isCurrentUser
                        ? 'text-muted-foreground/60'
                        : 'text-muted-foreground/60'
                    }`}
                  >
                    {formattedTime}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    );
  };

  return (
    <ScrollArea className="flex-1 px-3 sm:px-4 py-2 sm:py-4 h-[calc(100dvh-8rem)] sm:h-[calc(100%-8rem)]">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <span className="text-4xl mb-2">💬</span>
          <p className="text-muted-foreground text-sm">No messages yet, start the conversation.</p>
        </div>
      ) : isPending && isRecipient ? (
        <div className="text-center p-4 bg-muted rounded-lg mb-4">
          <p className="text-sm text-muted-foreground">
            Message request from {recipientName}
          </p>
        </div>
      ) : isRejected ? (
        <div className="text-center p-4 bg-muted rounded-lg mb-4">
          <p className="text-sm text-muted-foreground">
            You can't reply to this conversation
          </p>
        </div>
      ) : (
        renderMessages()
      )}
    </ScrollArea>
  );
};
