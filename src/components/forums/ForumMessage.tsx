import { Paperclip, MessageCircle, Heart } from "lucide-react";
import { ForumMessage } from "@/types/forum";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ViewableProfilePicture } from "@/components/profile/ViewableProfilePicture";

interface ForumMessageProps {
  message: ForumMessage;
  isCurrentUser: boolean;
  showDateHeader: boolean;
  formattedDate: string;
  onLike?: (messageId: string) => void;
  onComment?: (messageId: string, content: string) => void;
}

const formatMessageTime = (date: Date) => {
  return format(date, 'HH:mm');
};

export const ForumMessageComponent = ({ 
  message, 
  isCurrentUser, 
  showDateHeader,
  formattedDate,
  onLike,
  onComment
}: ForumMessageProps) => {
  const messageDate = new Date(message.created_at);
  const formattedTime = formatMessageTime(messageDate);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleComment = () => {
    if (newComment.trim() && onComment) {
      onComment(message.id, newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div>
      {showDateHeader && (
        <div className="flex justify-center my-4">
          <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
            {formattedDate}
          </div>
        </div>
      )}
      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className={`flex flex-col max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
          <div className={`rounded-2xl px-4 py-2 ${
            isCurrentUser
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-muted rounded-bl-sm'
          }`}>
            {!isCurrentUser && (
              <p className="text-sm font-medium mb-1 text-primary">
                {message.user.first_name} {message.user.last_name}
              </p>
            )}
            <div className="space-y-2">
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
              {message.attachments && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {message.attachments.map((attachment, index) => {
                    if (attachment.type === 'image') {
                      return (
                        <img
                          key={index}
                          src={attachment.url}
                          alt={attachment.name}
                          className="rounded-lg max-h-48 object-cover cursor-pointer hover:opacity-90"
                          onClick={() => window.open(attachment.url, '_blank')}
                        />
                      );
                    } else if (attachment.type === 'video') {
                      return (
                        <video
                          key={index}
                          src={attachment.url}
                          controls
                          className="rounded-lg max-h-48 w-full"
                        />
                      );
                    } else {
                      return (
                        <a
                          key={index}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-2 border rounded hover:bg-gray-50"
                        >
                          <Paperclip className="w-4 h-4 mr-2" />
                          <span className="truncate">{attachment.name}</span>
                        </a>
                      );
                    }
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-xs text-muted-foreground/60">
              {formattedTime}
            </span>
            <div className="flex items-center gap-4">
              {onLike && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`p-0 h-auto ${message.isLiked ? 'text-primary' : 'text-muted-foreground/60'}`}
                  onClick={() => onLike(message.id)}
                >
                  <Heart className={`w-4 h-4 ${message.isLiked ? 'fill-primary' : ''}`} />
                  <span className="ml-1 text-xs">{message.likes}</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className={`p-0 h-auto ${showComments ? 'text-primary' : 'text-muted-foreground/60'}`}
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="ml-1 text-xs">{message.comments?.length || 0}</span>
              </Button>
            </div>
          </div>
          
          {/* Comments Section */}
          {showComments && (
            <div className="mt-2 w-full bg-background rounded-lg border p-3">
              {/* Comments List */}
              <div 
                className="max-h-[240px] overflow-y-auto mb-3 custom-scrollbar"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgb(203 213 225) transparent'
                }}
              >
                {message.comments && message.comments.length > 0 ? (
                  message.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-2 mb-3 last:mb-0">
                      <div className="flex-shrink-0">
                        <ViewableProfilePicture
                          avatarUrl={comment.user.avatar_url}
                          size="sm"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-muted rounded-lg p-2">
                          <p className="text-xs font-medium truncate">
                            {comment.user.first_name} {comment.user.last_name}
                          </p>
                          <p className="text-sm break-words">{comment.content}</p>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 block">
                          {format(new Date(comment.created_at), 'MMM d, HH:mm')}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    No comments yet
                  </div>
                )}
              </div>
              
              {/* New Comment Input */}
              {onComment && (
                <div className="flex gap-2 pt-2 border-t">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="min-h-[32px] h-8 py-1 px-2 text-sm resize-none"
                  />
                  <Button
                    size="sm"
                    className="h-8 flex-shrink-0"
                    onClick={handleComment}
                    disabled={!newComment.trim()}
                  >
                    Reply
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 
