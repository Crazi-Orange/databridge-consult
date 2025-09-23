export interface Order {
  id: string;
  user_id: string;
  items: { product_id: string; quantity: number }[];
  total: number;
  status: 'pending' | 'completed' | 'shipped';
  created_at: string; // ISO string
  updated_at?: string;
}
