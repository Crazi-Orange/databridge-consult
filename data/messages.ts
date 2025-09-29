import { Message } from '../types/message';

export const messages: Message[] = [
  { id: '1', user_id: '1', body: 'Your service order is pending', sent_at: new Date().toISOString(), status: 'sent' },
  { id: '2', user_id: '1', body: 'New product added to shop', sent_at: new Date().toISOString(), status: 'pending' },
];
