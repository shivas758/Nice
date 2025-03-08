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
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

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
const toggleReplies = (commentId: string) => {
  setExpandedComments(prev => {
    const newSet = new Set(prev);
    if (newSet.has(commentId)) {
      newSet.delete(commentId);
    } else {
      newSet.add(commentId);
    }
    return newSet;
  });
};

const renderComment = (comment: Comment) => {
  const showReplies = expandedComments.has(comment.id);
  return (
      <div key={comment.id}>
        <div className="flex items-start space-x-2">
          <ViewableProfilePicture
            avatarUrl={comment.user.avatar_url}
            size="sm"
            className="flex-shrink-0 w-6 h-6"
          />
          <div className="flex-1">
            <div className="inline-flex items-center gap-2">
              <span className="text-xs font-medium">
                {comment.user.first_name} {comment.user.last_name}
              </span>
              <span className="text-xs text-zinc-500">
                • {format(new Date(comment.created_at), 'MMM d')}
              </span>
            </div>
            <div className="text-sm mt-1 text-zinc-800">{comment.content}</div>
            {comment.replies && comment.replies.length > 0 && (
              <div className="flex items-center gap-4 mt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-zinc-500 hover:text-zinc-900"
                  onClick={() => toggleReplies(comment.id)}
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  {showReplies ? 'Hide Replies' : `View ${comment.replies.length} ${comment.replies.length === 1 ? 'Reply' : 'Replies'}`}
                </Button>
              </div>
            )}
            {showReplies && comment.replies && comment.replies.length > 0 && (
              <div className="mt-3 space-y-3 ml-6 border-l-2 border-zinc-200 pl-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex items-start space-x-2">
                    <ViewableProfilePicture
                      avatarUrl={reply.user.avatar_url}
                      size="sm"
                      className="flex-shrink-0 w-6 h-6"
                    />
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2">
                        <span className="text-xs font-medium">
                          {reply.user.first_name} {reply.user.last_name}
                        </span>
                        <span className="text-xs text-zinc-500">
                          • {format(new Date(reply.created_at), 'MMM d')}
                        </span>
                      </div>
                      <div className="text-sm mt-1 text-zinc-800">{reply.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const findParentComment = (parentId: string): Comment | undefined => {
    return message.comments.find(c => c.id === parentId);
  };

  return (
    <div className="bg-white rounded-md border hover:border-zinc-400 transition-colors">
      {/* Post Header & Content */}
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <ViewableProfilePicture
            avatarUrl={message.user.avatar_url}
            size="sm"
            className="w-7 h-7"
          />
          <div className="flex items-center text-[13px]">
            <span className="font-medium text-zinc-900">
              {message.user.first_name} {message.user.last_name}
            </span>
            <span className="text-zinc-500 mx-1">•</span>
            <span className="text-zinc-500">
              {format(new Date(message.created_at), 'MMM d, yyyy')}
            </span>
          </div>
        </div>

        {/* Post Content */}
        <div className="pl-9">
          <p className="text-[15px] leading-[1.6] text-zinc-900 whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-3 pl-9">
            <div className="overflow-hidden rounded-md border border-zinc-200">
              {message.attachments.map((attachment, index) => {
                if (attachment.type === 'image') {
                  return (
                    <div
                      key={index}
                      className="cursor-zoom-in overflow-hidden bg-zinc-50"
                      onClick={() => window.open(attachment.url, '_blank')}
                    >
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="w-full h-auto max-h-[512px] object-contain hover:opacity-95 transition-opacity"
                      />
                    </div>
                  );
                } else if (attachment.type === 'video') {
                  return (
                    <div key={index} className="bg-black">
                      <video
                        src={attachment.url}
                        controls
                        className="w-full h-auto max-h-[512px]"
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
      <div className="border-t border-zinc-200 px-4 py-2">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 px-2 hover:bg-zinc-100 ${message.isLiked ? 'text-orange-500' : 'text-zinc-500'}`}
            onClick={handleLike}
          >
            <Heart className={`w-4 h-4 mr-2 ${message.isLiked ? 'fill-orange-500 text-orange-500' : ''}`} />
            <span className="text-xs font-medium">
              {message.likes > 0 ? message.likes : 'Like'}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-zinc-500 hover:bg-zinc-100 flex items-center"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            <span className="text-xs font-medium">
              {message.comments?.length || 0} Comments
            </span>
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t">
          {/* New Comment Input */}
          <div className="p-3 bg-zinc-50">
            <div className="flex items-center space-x-3">
              <ViewableProfilePicture
                avatarUrl={currentUserAvatar}
                size="sm"
                className="w-8 h-8"
              />
              <div className="flex-1">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="What are your thoughts?"
                  className="min-h-[80px] py-2 px-3 resize-none bg-white border-zinc-200 focus:border-blue-500 text-sm"
                />
                <Button
                  size="sm"
                  className="mt-2 px-4 bg-zinc-800 hover:bg-zinc-900 text-white"
                  onClick={handleComment}
                  disabled={!newComment.trim()}
                >
                  Comment
                </Button>
              </div>
            </div>
          </div>

          {/* Comment List */}
          <div className="divide-y divide-zinc-100">
            {message.comments && message.comments.length > 0 ? (
              message.comments.map((comment) => !comment.parent_id && (
                <div key={comment.id} className="py-4 px-4">
                  {renderComment(comment)}
                  <div className="ml-8 mt-2 flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-zinc-500 hover:text-zinc-900"
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    >
                      <Reply className="w-3 h-3 mr-1" />
                      Reply
                    </Button>
                  </div>
                  {replyingTo === comment.id && (
                    <div className="flex items-center space-x-2 mt-3 ml-8">
                      <Textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`Reply to ${comment.user.first_name}...`}
                        className="min-h-0 h-9 py-2 px-3 resize-none bg-white border text-sm"
                      />
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
                </div>
              ))
            ) : (
              <div className="text-center text-sm text-zinc-500 py-8">
                No comments yet. Be the first to share what you think!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
