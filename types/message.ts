export interface Message {
  id: string;
  user_id: string;
  body: string;
  sent_at: string; // ISO string
  status: 'sent' | 'failed' | 'pending';
}
