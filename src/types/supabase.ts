export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  profession?: string;
  languages?: string[];
}

export interface Message {
  id: string;
  content: string;
  created_at: string;
  message_request_status: string;
  sender_id: string;
  receiver_id: string;
  sender: Profile;
  receiver: Profile;
}
