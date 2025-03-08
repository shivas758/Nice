
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ForumMessage } from "@/types/forum";
import type { Json } from "@/integrations/supabase/types";

const CommunityPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [forum, setForum] = useState<any>(null);
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (id) {
      fetchForumDetails();
      fetchMessages();
    }
  }, [id]);

  const fetchForumDetails = async () => {
    const { data, error } = await supabase
      .from('forums')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch forum details",
        variant: "destructive"
      });
      return;
    }

    setForum(data);
  };

  const fetchMessages = async () => {
    if (!user) return;

    try {
      const { data: messageData, error: messageError } = await supabase
        .from('forum_messages')
        .select(`
          *,
          user:profiles(first_name, last_name)
        `)
        .eq('forum_id', id)
        .order('created_at', { ascending: true });

      if (messageError) throw messageError;

      const messagesWithDetails = await Promise.all(
        (messageData || []).map(async (message: any) => {
          const { count } = await supabase
            .from('forum_message_bookmarks')
            .select('id', { count: 'exact', head: true })
            .eq('message_id', message.id);

          const { data: bookmarkData } = await supabase
            .from('forum_message_bookmarks')
            .select('id')
            .eq('message_id', message.id)
            .eq('user_id', user.id)
            .single();

          const { data: likesData } = await supabase
            .from('forum_message_likes')
            .select('id')
            .eq('message_id', message.id);

          const { data: userLikeData } = await supabase
            .from('forum_message_likes')
            .select('id')
            .eq('message_id', message.id)
            .eq('user_id', user.id)
            .single();

          // Transform attachments with proper type checking
          const attachments = Array.isArray(message.attachments) 
            ? message.attachments.map((att: Json) => {
                if (typeof att === 'object' && att !== null) {
                  const attachment = att as { [key: string]: Json };
                  return {
                    type: (attachment.type as string || 'file') as 'image' | 'video' | 'file',
                    url: attachment.url as string || '',
                    name: attachment.name as string || ''
                  };
                }
                return null;
              }).filter((att): att is NonNullable<typeof att> => att !== null)
            : [];

          const transformedMessage: ForumMessage = {
            id: message.id,
            content: message.content,
            created_at: message.created_at,
            user_id: message.user_id,
            forum_id: message.forum_id,
            attachments,
            user: message.user || { first_name: 'Unknown', last_name: 'User' },
            likes: likesData?.length || 0,
            isLiked: !!userLikeData,
            comments: [],
            image_url: message.image_url,
            bookmarks: count || 0,
            is_bookmarked: !!bookmarkData
          };

          return transformedMessage;
        })
      );

      setMessages(messagesWithDetails);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async () => {
    if (!user || !newMessage.trim()) return;

    try {
      const messageData: {
        content: string;
        forum_id: string;
        user_id: string;
      } = {
        content: newMessage.trim(),
        forum_id: id!,
        user_id: user.id
      };

      const { data: messageData2, error: messageError } = await supabase
        .from('forum_messages')
        .insert([messageData])
        .select('*')
        .single();

      if (messageError) {
        throw messageError;
      }

      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        throw userError;
      }

      const completeMessage: ForumMessage = {
        ...messageData2,
        user: userData,
        likes: 0,
        isLiked: false,
        comments: [],
        attachments: [],
        bookmarks: 0,
        is_bookmarked: false
      };

      setMessages([...messages, completeMessage]);
      setNewMessage("");
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const toggleBookmark = async (messageId: string, isCurrentlyBookmarked: boolean) => {
    try {
      if (isCurrentlyBookmarked) {
        await supabase
          .from('forum_message_bookmarks')
          .delete()
          .eq('message_id', messageId)
          .eq('user_id', user?.id);
      } else {
        await supabase
          .from('forum_message_bookmarks')
          .insert([{ message_id: messageId, user_id: user?.id }]);
      }

      setMessages(messages.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            bookmarks: isCurrentlyBookmarked ? msg.bookmarks! - 1 : msg.bookmarks! + 1,
            is_bookmarked: !isCurrentlyBookmarked
          };
        }
        return msg;
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-4 pb-20">
      {forum && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary">{forum.name}</h1>
          <p className="text-gray-600 mt-2">{forum.description}</p>
        </div>
      )}

      <div className="space-y-4">
        {messages.map((message) => (
          <Card key={message.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">
                  {message.user.first_name} {message.user.last_name}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleBookmark(message.id, message.is_bookmarked!)}
                className={message.is_bookmarked ? "text-primary" : "text-gray-500"}
              >
                <Bookmark className="w-4 h-4 mr-1" />
                <span>{message.bookmarks}</span>
              </Button>
            </div>
            <p className="text-gray-700 mb-4">{message.content}</p>
          </Card>
        ))}
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-background border-t p-4">
        <div className="container mx-auto flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 min-w-0 rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button onClick={handleSendMessage}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
