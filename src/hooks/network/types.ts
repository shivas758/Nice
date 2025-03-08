import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export interface FriendRecord {
  id: string;
  user_id: string;
  friend_id: string;
  created_at: string;
}

export interface FriendRequest {
  id: string;
  sender: {
    id: string;
    first_name: string;
    last_name: string;
  };
  status: string;
}

export type FriendRequestPayload = {
  requestId: string;
  status: string;
  senderId: string;
};

export type FriendRecordPayload = RealtimePostgresChangesPayload<FriendRecord>;