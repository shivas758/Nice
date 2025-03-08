import { useState } from 'react';
import { ForumMessage, Comment } from '@/types/forum';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Send, Reply } from 'lucide-react';
import { format } from 'date-fns';
import { ViewableProfilePicture } from '@/components/profile/ViewableProfilePicture';

interface ForumPostProps {
  message: ForumMessage;
  isCurrentUser: boolean;
  currentUserId: string;
  currentUserAvatar: string | null;
  onLike: (messageId: string) => void;
  onComment: (messageId: string, content: string, parentId?: string) => void;
}

export const ForumPost = ({
  message,
  isCurrentUser,
  currentUserId,
  currentUserAvatar,
  onLike,
  onComment
}: ForumPostProps) => {
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleLike = () => {
    onLike(message.id);
  };

  const handleComment = () => {
    if (newComment.trim()) {
      onComment(message.id, newComment.trim());
      setNewComment('');
    }
  };

  const handleReply = (commentId: string) => {
    if (replyContent.trim()) {
      onComment(message.id, replyContent.trim(), commentId);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const renderComment = (comment: Comment, level: number = 0) => {
    return (
      <div key={comment.id} className={`flex space-x-3 ${level > 0 ? 'ml-8 relative before:absolute before:left-[-16px] before:top-8 before:bottom-0 before:w-[2px] before:bg-border' : ''}`}>
        <div className="relative">
          <ViewableProfilePicture
            avatarUrl={comment.user.avatar_url}
            size="sm"
            className="flex-shrink-0"
          />
          {level > 0 && (
            <div className="absolute left-[-16px] top-4 w-[16px] h-[2px] bg-border" />
          )}
        </div>
        <div className="flex-1">
          <div className={`bg-muted rounded-xl p-3 ${level > 0 ? 'bg-background border border-border' : ''}`}>
            <div className="font-semibold text-sm">
              {comment.user.first_name} {comment.user.last_name}
            </div>
            {level > 0 && comment.parent_id && (
              <div className="text-xs text-muted-foreground mt-1">
                Replying to {findParentComment(comment.parent_id)?.user.first_name} {findParentComment(comment.parent_id)?.user.last_name}
              </div>
            )}
            <div className="text-sm mt-1">{comment.content}</div>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <div className="text-xs text-muted-foreground ml-3">
              {format(new Date(comment.created_at), 'MMM d, yyyy h:mm a')}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            >
              <Reply className="w-3 h-3 mr-1" />
              Reply
            </Button>
          </div>
          {replyingTo === comment.id && (
            <div className="flex items-center space-x-2 mt-2 ml-4">
              <div className="relative w-full">
                <div className="absolute left-[-20px] top-4 w-[16px] h-[2px] bg-border" />
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`Reply to ${comment.user.first_name}...`}
                  className="min-h-0 h-9 py-2 px-3 resize-none bg-background border border-border text-sm"
                />
              </div>
              <Button 
                size="icon"
                className="h-9 w-9"
                onClick={() => handleReply(comment.id)}
                disabled={!replyContent.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => renderComment(reply, level + 1))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const findParentComment = (parentId: string): Comment | undefined => {
    return message.comments.find(c => c.id === parentId);
  };

  return (
    <div className="divide-y divide-border p-2 bg-white rounded-md">
      {/* Post Header */}
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <ViewableProfilePicture
            avatarUrl={message.user.avatar_url}
            size="sm"
          />
          <div className="flex flex-col justify-center">
            <div className="font-medium text-sm leading-tight">
              {message.user.first_name} {message.user.last_name}
            </div>
            <div className="text-xs text-muted-foreground leading-tight">
              {format(new Date(message.created_at), 'MMM d, yyyy h:mm a')}
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="mt-4 text-sm">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2">
            <div className="grid grid-cols-2 gap-2">
              {message.attachments.map((attachment, index) => {
                if (attachment.type === 'image') {
                  return (
                    <div key={index} className="relative pt-[100%]">
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="absolute inset-0 w-full h-full object-cover rounded-md cursor-pointer hover:opacity-90"
                        onClick={() => window.open(attachment.url, '_blank')}
                      />
                    </div>
                  );
                } else if (attachment.type === 'video') {
                  return (
                    <div key={index} className="relative pt-[100%]">
                      <video
                        src={attachment.url}
                        controls
                        className="absolute inset-0 w-full h-full object-cover rounded-md"
                      />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}

        {/* Like and Comment Counts */}
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            {message.likes > 0 && (
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <Heart className="w-2.5 h-2.5 text-white fill-white" />
                </div>
                <span className="ml-2">{message.likes}</span>
              </div>
            )}
            {message.comments?.length > 0 && (
              <button
                onClick={() => setShowComments(true)}
                className="flex items-center space-x-1 text-muted-foreground"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="text-xs">{message.comments.length}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 divide-x divide-border">
        <Button
          variant="ghost"
          className={`rounded-none h-8 ${message.isLiked ? 'text-primary' : ''}`}
          onClick={handleLike}
        >
          <Heart className={`w-4 h-4 ${message.isLiked ? 'fill-primary text-primary' : ''}`} />
        </Button>
        <Button
          variant="ghost"
          className="rounded-none h-8 flex items-center justify-center space-x-1"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs">{message.comments?.length || 0}</span>
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-2 bg-muted/30">
          {/* Comment List */}
          <div className="max-h-[240px] overflow-y-auto pr-2" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgb(203 213 225) transparent'
          }}>
            <div className="space-y-4">
              {message.comments && message.comments.length > 0 ? (
                message.comments.map((comment) => !comment.parent_id && renderComment(comment))
              ) : (
                <div className="text-center text-sm text-muted-foreground py-4">
                  No comments yet
                </div>
              )}
            </div>
          </div>

          {/* New Comment Input */}
          <div className="flex items-center space-x-3 mt-2 pt-2 border-t">
            <ViewableProfilePicture
              avatarUrl={currentUserAvatar}
              size="sm"
            />
            <div className="flex-1 flex items-center space-x-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="min-h-0 h-9 py-2 px-3 resize-none bg-muted"
              />
              <Button
                size="icon"
                className="h-9 w-9"
                onClick={handleComment}
                disabled={!newComment.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
