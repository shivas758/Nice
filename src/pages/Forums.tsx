import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, ImagePlus, Paperclip, X } from "lucide-react";
import { ViewableProfilePicture } from "@/components/profile/ViewableProfilePicture";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import { Link } from "react-router-dom";
import { ForumList } from "@/components/forums/ForumList";
import { MessageInput } from "@/components/forums/MessageInput";
import { ForumMessageComponent } from "@/components/forums/ForumMessage";
import { Forum as ForumType, ForumMessage, Comment } from "@/types/forum";
import imageCompression from 'browser-image-compression';
import { ForumPost } from '@/components/forums/ForumPost';
import { StorageError } from '@supabase/storage-js';
import { MessageAttachment } from '@/types/supabase';
import type { Json } from '@/integrations/supabase/types';

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

const Forums = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [forums, setForums] = useState<ForumType[]>([]);
  const [userForums, setUserForums] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<{ avatar_url: string | null }>({ avatar_url: null });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();
      
      if (!error && data) {
        setUserProfile(data);
      }
    };

    fetchUserProfile();
  }, [user?.id]);
  const [selectedForum, setSelectedForum] = useState<ForumType | null>(null);
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  useEffect(() => {
    console.log('Auth state changed:', { user });
    fetchForums();
    if (user) {
      fetchUserForums();
    }
  }, [user]);

  useEffect(() => {
    if (selectedForum) {
      fetchForumMessages(selectedForum.id);
      subscribeToMessages(selectedForum.id);
    }
  }, [selectedForum]);

  const fetchForumMessages = async (forumId: string) => {
    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from('forum_messages')
        .select(`
          id,
          content,
          created_at,
          user_id,
          forum_id,
          attachments
        `)
        .eq('forum_id', forumId)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      const likesPromises = messagesData.map(async message => {
        const { count } = await supabase
          .from('forum_message_likes')
          .select('*', { count: 'exact', head: true })
          .eq('message_id', message.id);
        return count || 0;
      });

      const userLikesPromises = messagesData.map(async message => {
        if (!user?.id) return false;
        const { data } = await supabase
          .from('forum_message_likes')
          .select('id')
          .eq('message_id', message.id)
          .eq('user_id', user.id)
          .single();
        return !!data;
      });

      const commentsPromises = messagesData.map(async message => {
        const { data: comments, error: commentsError } = await supabase
          .from('forum_message_comments')
          .select(`
            id,
            content,
            created_at,
            user_id,
            message_id,
            parent_id
          `)
          .eq('message_id', message.id)
          .order('created_at', { ascending: true });

        if (commentsError) {
          console.error('Error fetching comments:', commentsError);
          return [];
        }

        if (!comments) return [];

        const commentsWithUsers = await Promise.all(
          comments.map(async (comment) => {
            const { data: userData } = await supabase
              .from('profiles')
              .select('first_name, last_name, avatar_url')
              .eq('id', comment.user_id)
              .single();

            return {
              id: comment.id,
              content: comment.content,
              created_at: comment.created_at,
              user_id: comment.user_id,
              parent_id: comment.parent_id,
              user: userData || { first_name: 'Unknown', last_name: 'User' },
              replies: []
            };
          })
        );

        const commentMap = new Map();
        const rootComments: any[] = [];

        commentsWithUsers.forEach(comment => {
          commentMap.set(comment.id, comment);
        });

        commentsWithUsers.forEach(comment => {
          if (comment.parent_id) {
            const parentComment = commentMap.get(comment.parent_id);
            if (parentComment) {
              parentComment.replies = parentComment.replies || [];
              parentComment.replies.push(comment);
            }
          } else {
            rootComments.push(comment);
          }
        });

        return rootComments;
      });

      const userPromises = messagesData.map(async message => {
        const { data } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', message.user_id)
          .single();
          return data || { first_name: 'Unknown', last_name: 'User', avatar_url: '' };
      });

      const [likesResults, userLikesResults, commentsResults, userResults] = await Promise.all([
        Promise.all(likesPromises),
        Promise.all(userLikesPromises),
        Promise.all(commentsPromises),
        Promise.all(userPromises)
      ]);

      const transformedData: ForumMessage[] = messagesData.map((message, index) => ({
        ...message,
        likes: likesResults[index],
        isLiked: userLikesResults[index],
        comments: commentsResults[index],
        user: userResults[index],
        attachments: Array.isArray(message.attachments) 
          ? message.attachments.map((att: any) => ({
              type: att.type || 'file',
              url: att.url || '',
              name: att.name || ''
            }))
          : []
      }));

      setMessages(transformedData);
    } catch (error) {
      console.error('Error in fetchForumMessages:', error);
      toast({
        title: "Error",
        description: "Unable to fetch messages",
        variant: "destructive"
      });
      throw error;
    }
  };

  const subscribeToMessages = (forumId: string) => {
    supabase.channel(`forum_${forumId}`).unsubscribe();

    const channel = supabase
      .channel(`forum_${forumId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'forum_messages',
          filter: `forum_id=eq.${forumId}`,
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const { data: messageData } = await supabase
              .from('forum_messages')
              .select('id, content, created_at, user_id, forum_id, attachments')
              .eq('id', payload.new.id)
              .single();

            if (!messageData) return;

            const { data: userData } = await supabase
              .from('profiles')
              .select('first_name, last_name, avatar_url')
              .eq('id', messageData.user_id)
              .single();

            const attachments = Array.isArray(messageData.attachments) 
              ? messageData.attachments.map((att: any) => {
                  if (typeof att === 'object' && att !== null) {
                    return {
                      type: (att.type || 'file') as 'image' | 'video' | 'file',
                      url: att.url || '',
                      name: att.name || ''
                    };
                  }
                  return null;
                }).filter(Boolean)
              : [];

            const newMessage: ForumMessage = {
              ...messageData,
              likes: 0,
              isLiked: false,
              comments: [],
              user: userData || { first_name: 'Unknown', last_name: 'User', avatar_url: '' },
              attachments
            };

            setMessages(prev => {
              if (prev.find(m => m.id === messageData.id)) return prev;
              return [newMessage, ...prev];
            });
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            await fetchForumMessages(forumId);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    setAttachments(prev => [...prev, ...files]);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachmentPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
    setAttachmentPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const compressImage = async (file: File) => {
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: file.type
      };

      const compressedFile = await imageCompression(file, options);
      console.log('Compression complete:', {
        originalSize: (file.size / 1024 / 1024).toFixed(2) + 'MB',
        compressedSize: (compressedFile.size / 1024 / 1024).toFixed(2) + 'MB'
      });
      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      return file;
    }
  };

  const uploadAttachment = async (file: File) => {
    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      console.log('Starting upload process:', {
        user_id: user.id,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size
      });

      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File ${file.name} is too large. Maximum size is 10MB.`);
      }

      let fileToUpload = file;
      if (file.type.startsWith('image/')) {
        console.log('Compressing image...');
        fileToUpload = await compressImage(file);
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('Testing bucket access...');
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();

      if (bucketsError) {
        console.error('Error listing buckets:', {
          error: bucketsError,
          message: bucketsError.message
        });
        throw new Error(`Cannot list storage buckets: ${bucketsError.message}`);
      }

      console.log('Available buckets:', buckets?.map(b => ({
        id: b.id,
        name: b.name,
        public: b.public
      })));

      let forumBucket = buckets?.find(b => b.name === 'forum-attachments');
      
      if (!forumBucket) {
        console.log('Bucket not found, attempting to create it...');
        const { error: rpcError } = await supabase
          .rpc('create_bucket_policies');

        if (rpcError) {
          console.error('Error setting up bucket policies:', rpcError);
        }

        const { data: bucketCheck } = await supabase
          .storage
          .getBucket('forum-attachments');

        if (!bucketCheck) {
          throw new Error('Unable to access forum-attachments bucket. Please contact support.');
        }

        forumBucket = bucketCheck;
      }

      console.log('Using forum-attachments bucket:', forumBucket);

      const { data, error: uploadError } = await supabase.storage
        .from('forum-attachments')
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        handleUploadError(uploadError);
        return null;
      }

      console.log('Upload successful:', data);

      const { data: { publicUrl } } = supabase.storage
        .from('forum-attachments')
        .getPublicUrl(filePath);

      console.log('Public URL generated:', publicUrl);

      return {
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 'file',
        url: publicUrl,
        name: file.name
      };

    } catch (error: any) {
      console.error('Upload failed:', {
        error,
        message: error.message,
        code: error.code,
        details: error.details
      });
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleUploadError = (error: StorageError) => {
    console.error('Upload error details:', {
      error,
      message: error.message,
      name: error.name
    });
  
    toast({
      title: "Upload Failed",
      description: error.message || "Failed to upload file",
      variant: "destructive"
    });
  };

  const sendMessage = async () => {
    if (!user || !selectedForum || (!newMessage.trim() && attachments.length === 0)) return;

    try {
      toast({
        title: "Sending message",
        description: attachments.length > 0 ? "Uploading attachments..." : "Sending...",
      });

      const uploadPromises = attachments.map(file => uploadAttachment(file));
      const uploadedAttachments = await Promise.all(uploadPromises);
      
      const successfulAttachments = uploadedAttachments.filter(Boolean);

      if (attachments.length > 0 && successfulAttachments.length === 0) {
        toast({
          title: "Error",
          description: "Failed to upload attachments",
          variant: "destructive"
        });
        return;
      }

      const { data: messageData, error: messageError } = await supabase
        .from('forum_messages')
        .insert([
          {
            content: newMessage.trim(),
            forum_id: selectedForum.id,
            user_id: user.id,
            attachments: successfulAttachments
          }
        ])
        .select('*')
        .single();

      if (messageError) {
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive"
        });
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      const completeMessage: ForumMessage = {
        ...messageData,
        likes: 0,
        isLiked: false,
        comments: [],
        user: {
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          avatar_url: profileData.avatar_url
        },
        attachments: (successfulAttachments || []) as MessageAttachment[]
      };

      setMessages(prev => [completeMessage, ...prev]);
      setNewMessage("");
      setAttachments([]);
      setAttachmentPreviews([]);

      toast({
        title: "Success",
        description: "Message sent successfully"
      });

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const fetchForums = async () => {
    console.log('Fetching forums...');
    const { data, error } = await supabase
      .from('forums')
      .select('*')
      .order('created_at');

    if (error) {
      console.error('Error fetching forums:', error);
      return;
    }

    console.log('Forums fetched:', data);
    setForums(data || []);
  };

  const fetchUserForums = async () => {
    if (!user) {
      console.log('No user found, skipping user forums fetch');
      return;
    }

    console.log('Fetching user forums for user:', user.id);
    const { data, error } = await supabase
      .from('user_forums')
      .select('forum_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching user forums:', error);
      return;
    }

    console.log('User forums fetched:', data);
    setUserForums(data.map(uf => uf.forum_id));
  };

  const toggleForumMembership = async (forumId: string) => {
    console.log('Attempting to toggle forum membership:', { forumId, user });
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join forums",
        variant: "destructive"
      });
      return;
    }

    const isMember = userForums.includes(forumId);
    console.log('Current membership status:', { isMember, userForums });
    
    if (isMember) {
      console.log('Attempting to leave forum:', forumId);
      const { error } = await supabase
        .from('user_forums')
        .delete()
        .eq('user_id', user.id)
        .eq('forum_id', forumId);

      if (error) {
        console.error('Error leaving forum:', error);
        toast({
          title: "Error",
          description: "Failed to leave the forum",
          variant: "destructive"
        });
        return;
      }

      setUserForums(prev => prev.filter(id => id !== forumId));
      if (selectedForum?.id === forumId) {
        setSelectedForum(null);
      }
      toast({
        title: "Success",
        description: "Left the forum successfully"
      });
    } else {
      console.log('Attempting to join forum:', forumId);
      const { error } = await supabase
        .from('user_forums')
        .insert([
          {
            user_id: user.id,
            forum_id: forumId,
          },
        ]);

      if (error) {
        console.error('Error joining forum:', error);
        toast({
          title: "Error",
          description: "Failed to join the forum",
          variant: "destructive"
        });
        return;
      }

      setUserForums(prev => [...prev, forumId]);
      toast({
        title: "Success",
        description: "Joined the forum successfully"
      });
    }
  };

  const handleForumSelect = async (forum: ForumType) => {
    setMessages([]);
    setSelectedForum(forum);
    setIsReadOnly(!userForums.includes(forum.id));
    
    try {
      await fetchForumMessages(forum.id);
    } catch (error) {
      console.error('Error switching forums:', error);
      toast({
        title: "Error",
        description: "Failed to load messages for this community",
        variant: "destructive"
      });
    }
  };

  const handleLike = async (messageId: string) => {
    if (!user) return;

    try {
      const message = messages.find(m => m.id === messageId);
      if (!message) return;

      if (message.isLiked) {
        const { error } = await supabase
          .from('forum_message_likes')
          .delete()
          .eq('message_id', messageId)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error removing like:', error);
          toast({
            title: "Error",
            description: "Failed to unlike the post",
            variant: "destructive"
          });
          return;
        }

        setMessages(prev => prev.map(m => 
          m.id === messageId 
            ? { ...m, likes: m.likes - 1, isLiked: false }
            : m
        ));
      } else {
        const { error } = await supabase
          .from('forum_message_likes')
          .insert([
            { message_id: messageId, user_id: user.id }
          ]);

        if (error) {
          console.error('Error adding like:', error);
          toast({
            title: "Error",
            description: "Failed to like the post",
            variant: "destructive"
          });
          return;
        }

        setMessages(prev => prev.map(m => 
          m.id === messageId 
            ? { ...m, likes: m.likes + 1, isLiked: true }
            : m
        ));
      }
    } catch (error) {
      console.error('Error in handleLike:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive"
      });
    }
  };

  const handleComment = async (messageId: string, content: string, parentId?: string) => {
    try {
      if (!user?.id) return;

      const commentData: any = {
        message_id: messageId,
        user_id: user.id,
        content: content.trim()
      };

      if (parentId) {
        commentData.parent_id = parentId;
      }

      let commentResult;
      const { data: initialComment, error: commentError } = await supabase
        .from('forum_message_comments')
        .insert(commentData)
        .select('*')
        .single();

      if (commentError) {
        if (commentError.code === 'PGRST204' && parentId) {
          const { data: retryComment, error: retryError } = await supabase
            .from('forum_message_comments')
            .insert({
              message_id: messageId,
              user_id: user.id,
              content: content.trim()
            })
            .select('*')
            .single();

          if (retryError) throw retryError;
          commentResult = retryComment;

          toast({
            title: "Comment Added",
            description: "Reply functionality is not available yet. Your comment was added as a regular comment.",
            variant: "default"
          });
        } else {
          throw commentError;
        }
      } else {
        commentResult = initialComment;
      }

      const { data: userData } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', user.id)
        .single();

      setMessages(messages.map(msg => {
        if (msg.id === messageId) {
          const newCommentObj = {
            id: commentResult.id,
            content: commentResult.content,
            created_at: commentResult.created_at,
            user_id: commentResult.user_id,
            parent_id: commentResult.parent_id,
            user: userData || { first_name: 'Unknown', last_name: 'User', avatar_url: '' },
            replies: []
          };

          if (parentId && commentResult.parent_id) {
            return {
              ...msg,
              comments: msg.comments.map(comment => {
                if (comment.id === parentId) {
                  return {
                    ...comment,
                    replies: [...(comment.replies || []), newCommentObj]
                  };
                }
                return comment;
              })
            };
          } else {
            return {
              ...msg,
              comments: [...(msg.comments || []), newCommentObj]
            };
          }
        }
        return msg;
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    }
  };

  const renderMessages = () => {
    let currentDate: string | null = null;
    
    return (
      <div className="flex flex-col space-y-4">
        {messages.map((message) => (
          <ForumPost
            key={message.id}
            message={message}
            isCurrentUser={message.user_id === user?.id}
            currentUserId={user?.id || ''}
            currentUserAvatar={userProfile.avatar_url}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-6 h-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 h-full">
            <div className={`${selectedForum ? 'hidden md:block' : ''} md:col-span-3 md:sticky md:top-6 h-fit`}>
              <Card className="p-3 sm:p-4 shadow-sm rounded-md bg-white">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center md:text-left">
                  Communities
                </h2>
                <ForumList
                  forums={forums}
                  userForums={userForums}
                  onForumSelect={handleForumSelect}
                  onToggleMembership={toggleForumMembership}
                />
              </Card>
            </div>

            <div className={`${selectedForum ? '' : 'md:block'} md:block md:col-span-6 space-y-3 sm:space-y-6 overflow-y-auto max-h-[calc(100vh-2rem)]`}>
              {selectedForum ? (
                <>
                  <div className="md:hidden sticky top-0 z-10 bg-white border-b border-gray-200 pb-2 px-4">
                    <Button
                      variant="ghost"
                      className="flex items-center text-sm py-2 h-auto w-full justify-start hover:bg-transparent"
                      onClick={() => setSelectedForum(null)}
                    >
                      ← Back to Communities
                    </Button>
                  </div>

                  <Card className="p-4 shadow-sm sticky top-0 z-10 bg-white rounded-md">
                    <h1 className="text-xl sm:text-2xl font-bold">{selectedForum.name}</h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-2">
                      {selectedForum.description}
                    </p>
                    {!userForums.includes(selectedForum.id) && (
                      <Button
                        className="mt-4 w-full"
                        size="lg"
                        onClick={() => toggleForumMembership(selectedForum.id)}
                      >
                        Join Community
                      </Button>
                    )}
                  </Card>

                  <Card className="p-3 sm:p-4 shadow-sm sticky top-[calc(var(--header-height)+1rem)] z-10 bg-white rounded-md">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <ViewableProfilePicture
                        avatarUrl={userProfile.avatar_url}
                        size="sm"
                        className="shrink-0"
                        disableView={true}
                      />
                      <div className="flex-1 min-w-0">
                        <MessageInput
                          newMessage={newMessage}
                          setNewMessage={setNewMessage}
                          attachmentPreviews={attachmentPreviews}
                          onSend={sendMessage}
                          onFileSelect={handleFileSelect}
                          onRemoveAttachment={removeAttachment}
                        />
                      </div>
                    </div>
                  </Card>
<div className="space-y-2 pb-24 bg-white p-4 rounded-md shadow-sm">
  {renderMessages()}
</div>
 
                </>
              ) : (
                <Card className="p-6 sm:p-12 text-center rounded-md shadow-md bg-white">
                  <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">👋</div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-3">
                    Welcome to Communities
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-6">
                    Select a community from the left to start exploring and engaging with others!
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground">{forums.length} Communities Available</span>
                  </div>
                </Card>
              )}
            </div>

            <div className="hidden lg:block md:col-span-3">
              {selectedForum && (
                <Card className="p-4 shadow-sm sticky top-6">
                  <h2 className="text-xl font-semibold mb-4">About Community</h2>
                  <p className="text-muted-foreground">{selectedForum.description}</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forums;
