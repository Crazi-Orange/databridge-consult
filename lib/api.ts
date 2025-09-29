import { User, Service, Product, Order, ResearchRequest, Message, BlogPost } from '../types/database.types';

export async function fetchServices(): Promise<Service[]> {
  const response = await fetch('/api/services');
  if (!response.ok) throw new Error('Failed to fetch services');
  return response.json();
}

export async function fetchService(id: string): Promise<Service> {
  const response = await fetch(`/api/services/${id}`);
  if (!response.ok) throw new Error('Failed to fetch service');
  return response.json();
}

// Similar for create, update, delete services (POST, PUT, DELETE)

export async function createService(data: Partial<Service>): Promise<Service> {
  const response = await fetch('/api/services', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create service');
  return response.json();
}

/**
 * Updates an existing service
 * @param id - The unique identifier of the service
 * @param data - Partial Service object containing the updated service details
 * @returns Promise containing the updated Service object
 * @throws Error if the service update fails
 */
export async function updateService(id: string, data: Partial<Service>): Promise<Service> {
  const response = await fetch(`/api/services/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update service');
  return response.json();
}

/**
 * Deletes a service
 * @param id - The unique identifier of the service to delete
 * @returns Promise that resolves when the service is deleted
 * @throws Error if the service deletion fails
 */
export async function deleteService(id: string): Promise<void> {
  const response = await fetch(`/api/services/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete service');
}

// Products API, orders, research_requests, messages, users, blog

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('/api/products');
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

export async function fetchProduct(id: string): Promise<Product> {
  const response = await fetch(`/api/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json();
}

export async function createProduct(data: Partial<Product>): Promise<Product> {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

/**
 * Updates an existing product
 * @param id - The unique identifier of the product
 * @param data - Partial Product object containing the updated product details
 * @returns Promise containing the updated Product object
 * @throws Error if the product update fails
 */
export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  const res = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
}

/**
 * Deletes a product
 * @param id - The unique identifier of the product to delete
 * @returns Promise that resolves when the product is deleted
 * @throws Error if the product deletion fails
 */
export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete product');
}

export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch('/api/orders');
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function fetchOrder(id: string): Promise<Order> {
  const res = await fetch(`/api/orders/${id}`);
  if (!res.ok) throw new Error('Failed to fetch order');
  return res.json();
}

export async function createOrder(data: Partial<Order>): Promise<Order> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create order');
  return res.json();
}

/**
 * Updates an existing order
 * @param id - The unique identifier of the order
 * @param data - Partial Order object containing the updated order details
 * @returns Promise containing the updated Order object
 * @throws Error if the order update fails
 */
export async function updateOrder(id: string, data: Partial<Order>): Promise<Order> {
  const res = await fetch(`/api/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update order');
  return res.json();
}

/**
 * Deletes an order
 * @param id - The unique identifier of the order to delete
 * @returns Promise that resolves when the order is deleted
 * @throws Error if the order deletion fails
 */
export async function deleteOrder(id: string): Promise<void> {
  const res = await fetch(`/api/orders/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete order');
}

export async function fetchResearchRequests(): Promise<ResearchRequest[]> {
  const res = await fetch('/api/research-requests');
  if (!res.ok) throw new Error('Failed to fetch research requests');
  return res.json();
}

export async function fetchResearchRequest(id: string): Promise<ResearchRequest> {
  const res = await fetch(`/api/research-requests/${id}`);
  if (!res.ok) throw new Error('Failed to fetch research request');
  return res.json();
}

export async function createResearchRequest(data: Partial<ResearchRequest>): Promise<ResearchRequest> {
  const res = await fetch('/api/research-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create research request');
  return res.json();
}

/**
 * Updates an existing research request
 * @param id - The unique identifier of the research request
 * @param data - Partial ResearchRequest object containing the updated details
 * @returns Promise containing the updated ResearchRequest object
 * @throws Error if the research request update fails
 */
export async function updateResearchRequest(id: string, data: Partial<ResearchRequest>): Promise<ResearchRequest> {
  const res = await fetch(`/api/research-requests/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update research request');
  return res.json();
}

/**
 * Deletes a research request
 * @param id - The unique identifier of the research request to delete
 * @returns Promise that resolves when the research request is deleted
 * @throws Error if the research request deletion fails
 */
export async function deleteResearchRequest(id: string): Promise<void> {
  const res = await fetch(`/api/research-requests/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete research request');
}

export async function fetchMessages(): Promise<Message[]> {
  const response = await fetch('/api/messages');
  if (!response.ok) throw new Error('Failed to fetch messages');
  return response.json();
}

export async function fetchMessage(id: string): Promise<Message> {
  const res = await fetch(`/api/messages/${id}`);
  if (!res.ok) throw new Error('Failed to fetch message');
  return res.json();
}

export async function createMessage(data: Partial<Message>): Promise<Message> {
  const res = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create message');
  return res.json();
}

/**
 * Updates an existing message
 * @param id - The unique identifier of the message
 * @param data - Partial Message object containing the updated message details
 * @returns Promise containing the updated Message object
 * @throws Error if the message update fails
 */
export async function updateMessage(id: string, data: Partial<Message>): Promise<Message> {
  const res = await fetch(`/api/messages/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update message');
  return res.json();
}

/**
 * Deletes a message
 * @param id - The unique identifier of the message to delete
 * @returns Promise that resolves when the message is deleted
 * @throws Error if the message deletion fails
 */
export async function deleteMessage(id: string): Promise<void> {
  const res = await fetch(`/api/messages/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete message');
}

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch('/api/users');
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

export async function fetchUser(id: string): Promise<User> {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function createUser(data: Partial<User>): Promise<User> {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
}

/**
 * Updates an existing user
 * @param id - The unique identifier of the user
 * @param data - Partial User object containing the updated user details
 * @returns Promise containing the updated User object
 * @throws Error if the user update fails
 */
export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  const res = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

/**
 * Deletes a user
 * @param id - The unique identifier of the user to delete
 * @returns Promise that resolves when the user is deleted
 * @throws Error if the user deletion fails
 */
export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete user');
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const response = await fetch('/api/blog');
  if (!response.ok) throw new Error('Failed to fetch blog posts');
  return response.json();
}

export async function fetchBlogPost(slug: string): Promise<BlogPost> {
  const res = await fetch(`/api/blog/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch blog post');
  return res.json();
}

/**
 * Creates a new blog post
 * @param data - Partial BlogPost object containing the new post details
 * @returns Promise containing the created BlogPost object
 * @throws Error if the blog post creation fails
 */
export async function createBlogPost(data: Partial<BlogPost>): Promise<BlogPost> {
  const res = await fetch('/api/blog', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create blog post');
  return res.json();
}

/**
 * Updates an existing blog post
 * @param slug - The unique slug of the blog post
 * @param data - Partial BlogPost object containing the updated post details
 * @returns Promise containing the updated BlogPost object
 * @throws Error if the blog post update fails
 */
export async function updateBlogPost(slug: string, data: Partial<BlogPost>): Promise<BlogPost> {
  const res = await fetch(`/api/blog/${slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update blog post');
  return res.json();
}

/**
 * Deletes a blog post
 * @param slug - The unique slug of the blog post to delete
 * @returns Promise that resolves when the blog post is deleted
 * @throws Error if the blog post deletion fails
 */
export async function deleteBlogPost(slug: string): Promise<void> {
  const res = await fetch(`/api/blog/${slug}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete blog post');
}

// Auth
export async function login(email: string, password: string): Promise<{ user: User }> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Failed to login');
  return response.json();
}

export async function signup(name: string, email: string, password: string): Promise<{ user: User }> {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!response.ok) throw new Error('Failed to signup');
  return response.json();
}