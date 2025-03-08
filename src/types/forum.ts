
export interface Forum {
  id: string;
  name: string;
  description: string;
}

export interface UserForum {
  forum_id: string;
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_id?: string;
  user: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
  replies?: Comment[];
}

export interface ForumMessage {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  forum_id: string;
  attachments?: {
    type: 'image' | 'video' | 'file';
    url: string;
    name: string;
  }[];
  user: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
  likes: number;
  isLiked: boolean;
  image_url?: string | null;
  comments: Comment[];
  bookmarks?: number;
  is_bookmarked?: boolean;
} 
