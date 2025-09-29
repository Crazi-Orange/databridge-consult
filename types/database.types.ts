export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'user' | 'admin' | 'superadmin';
  created_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  is_free: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  total_amount: number;
  created_at: string;
}

export interface ResearchRequest {
  id: string;
  user_id: string;
  service_id: string;
  details: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  file_url: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  type: 'system' | 'user' | 'whatsapp';
  created_at: string;
}

export interface Testimonial {
  id: string;
  user_id: string;
  content: string;
  rating: number;
  created_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: 'IT' | 'Research';
  created_at: string;
}

export interface JwtPayload {
    id: string;
    email: string;
    role: string;
    created_at: number;
    expire_at: number;
} 