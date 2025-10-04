export enum Role {
  User = 'user',
  Admin = 'admin',
  Superadmin = 'superadmin',
}

export enum UserStatus {
  Active = 'active',
  Suspended = 'suspended',
  Pending = 'pending',
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  status: UserStatus;
  created_at: string;
  updated_at?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface AuthResponse {
  user: AuthUser;
}

export interface ApiRequest {
  headers: {
    cookie?: string;
  };
  ip?: string;
}

export interface ApiResponseLike {
  setHeader: (name: string, value: string | string[]) => void;
  headers: Headers;
}

export interface User {
  id: string;
  email: string;
  role: Role;
  status: UserStatus;
  password_hash: string;
  profile_data: {
    name?: string;
    [key: string]: unknown;
  };
  created_at: string;
  updated_at: string;
  failed_login_attempts?: number;
  last_failed_login?: string;
}

export interface LoginAttempt {
  id: string;
  email: string;
  timestamp: string;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  refresh_token: string;
  expires_at: string;
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
  excerpt: string;
  created_at: string;
  published_at: string;
  updated_at: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  iss: string;
  exp: number;
  iat?: number;
}

export interface RefreshTokenPayload {
  sub: string;
  email: string;
  role: string;
  refresh_id: string;
  iss: string;
  exp: number;
  iat?: number;
}