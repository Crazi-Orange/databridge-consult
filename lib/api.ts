import {
  User,
  Service,
  Product,
  Order,
  ResearchRequest,
  Message,
  BlogPost,
  ApiResponse,
  AuthResponse,
  AuthUser,
} from '../types/database.types';

// Debug flag from environment variable
const isDebug = process.env.NEXT_PUBLIC_DEBUG === 'true';

// Base URL for API calls - works in both server and client components
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client side - use relative URL
    return '';
  }
  // Server side - use absolute URL
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

// Helper function to log debug information safely
const logDebug: (message: string, details?: unknown) => void = (message: string, details?: unknown) => {
  if (isDebug) {
    console.debug(`[API Debug] ${message}`, details || {});
  }
};


// Helper function to handle non-JSON responses
const handleNonJsonResponse = async (response: Response): Promise<string> => {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('text/html')) {
    const text = await response.text();
    return `Received HTML response: ${text.slice(0, 200)}...`; // Limit length for safety
  }
  return `Unexpected content type: ${contentType}`;
};

// Helper function for API calls
// app/lib/api.ts (partial update)
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  logDebug(`Making request to ${url}`, { method: options.method || 'GET', headers: options.headers });

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const errorDetails = {
      url,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    };

    // Handle redirect responses (e.g., 302)
    if (response.redirected) {
      console.log('Redirect detected, navigating to:', response.url);
      if (typeof window !== 'undefined') {
        window.location.href = response.url;
      }
      throw new Error(`Redirected to ${response.url}`);
    }

    if (!response.ok) {
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const errorMessage = await handleNonJsonResponse(response);
        logDebug('Non-JSON response error', { ...errorDetails, body: errorMessage });
        throw new Error(`API error at ${url}: ${response.status} ${response.statusText} - ${errorMessage}`);
      }

      const errorBody = await response.json().catch(() => ({}));
      logDebug('API request failed', { ...errorDetails, body: errorBody });
      throw new Error(`API error at ${url}: ${response.status} ${response.statusText} - ${errorBody.message || 'Unknown error'}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const errorMessage = await handleNonJsonResponse(response);
      logDebug('Unexpected non-JSON response', { ...errorDetails, body: errorMessage });
      throw new Error(`API error at ${url}: Expected JSON, got ${contentType} - ${errorMessage}`);
    }

    const data = await response.json();
    logDebug(`Request to ${url} succeeded`, { status: response.status });
    return data as T;
  } catch (error) {
    logDebug('Unexpected error in apiFetch', { url, error: (error as Error).message });
    throw error;
  }
}

// Update login function to handle user data from headers if needed
export async function login(email: string, password: string): Promise<{ user: AuthUser }> {
  const res = await apiFetch<ApiResponse<AuthResponse>>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (!res.success) {
    throw new Error(res.error?.message || 'Login failed');
  }

  return { user: res.data!.user };
}

// Services API
export async function fetchServices(): Promise<Service[]> {
  return apiFetch<Service[]>('/api/services');
}

export async function fetchService(id: string): Promise<Service> {
  return apiFetch<Service>(`/api/services/${id}`);
}

export async function createService(data: Partial<Service>): Promise<Service> {
  return apiFetch<Service>('/api/services', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Updates an existing service
 * @param id - The unique identifier of the service
 * @param data - Partial Service object containing the updated service details
 * @returns Promise containing the updated Service

 object
 * @throws Error if the service update fails
 */
export async function updateService(id: string, data: Partial<Service>): Promise<Service> {
  return apiFetch<Service>(`/api/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Deletes a service
 * @param id - The unique identifier of the service to delete
 * @returns Promise that resolves when the service is deleted
 * @throws Error if the service deletion fails
 */
export async function deleteService(id: string): Promise<void> {
  return apiFetch<void>(`/api/services/${id}`, { method: 'DELETE' });
}

// Products API
export async function fetchProducts(): Promise<Product[]> {
  return apiFetch<Product[]>('/api/products');
}

export async function fetchProduct(id: string): Promise<Product> {
  return apiFetch<Product>(`/api/products/${id}`);
}

export async function createProduct(data: Partial<Product>): Promise<Product> {
  return apiFetch<Product>('/api/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Updates an existing product
 * @param personally - The unique identifier of the product
 * @param data - Partial Product object containing the updated product details
 * @returns Promise containing the updated Product object
 * @throws Error if the product update fails
 */
export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  return apiFetch<Product>(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Deletes a product
 * @param id - The unique identifier of the product to delete
 * @returns Promise that resolves when the product is deleted
 * @throws Error if the product deletion fails
 */
export async function deleteProduct(id: string): Promise<void> {
  return apiFetch<void>(`/api/products/${id}`, { method: 'DELETE' });
}

// Orders API
export async function fetchOrders(): Promise<Order[]> {
  return apiFetch<Order[]>('/api/orders');
}

export async function fetchOrder(id: string): Promise<Order> {
  return apiFetch<Order>(`/api/orders/${id}`);
}

export async function createOrder(data: Partial<Order>): Promise<Order> {
  return apiFetch<Order>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Updates an existing order
 * @param id - The unique identifier of the order
 * @param data - Partial Order object containing the updated order details
 * @returns Promise containing the updated Order object
 * @throws Error if the order update fails
 */
export async function updateOrder(id: string, data: Partial<Order>): Promise<Order> {
  return apiFetch<Order>(`/api/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Deletes an order
 * @param id - The unique identifier of the order to delete
 * @returns Promise that resolves when the order is deleted
 * @throws Error if the order deletion fails
 */
export async function deleteOrder(id: string): Promise<void> {
  return apiFetch<void>(`/api/orders/${id}`, { method: 'DELETE' });
}

// Research Requests API
export async function fetchResearchRequests(): Promise<ResearchRequest[]> {
  return apiFetch<ResearchRequest[]>('/api/research-requests');
}

export async function fetchResearchRequest(id: string): Promise<ResearchRequest> {
  return apiFetch<ResearchRequest>(`/api/research-requests/${id}`);
}

export async function createResearchRequest(data: Partial<ResearchRequest>): Promise<ResearchRequest> {
  return apiFetch<ResearchRequest>('/api/research-requests', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Updates an existing research request
 * @param id - The unique identifier of the research request
 * @param data - Partial ResearchRequest object containing the updated details
 * @returns Promise containing the updated ResearchRequest object
 * @throws Error if the research request update fails
 */
export async function updateResearchRequest(id: string, data: Partial<ResearchRequest>): Promise<ResearchRequest> {
  return apiFetch<ResearchRequest>(`/api/research-requests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Deletes a research request
 * @param id - The unique identifier of the research request to delete
 * @returns Promise that resolves when the research request is deleted
 * @throws Error if the research request deletion fails
 */
export async function deleteResearchRequest(id: string): Promise<void> {
  return apiFetch<void>(`/api/research-requests/${id}`, { method: 'DELETE' });
}

// Messages API
export async function fetchMessages(): Promise<Message[]> {
  return apiFetch<Message[]>('/api/messages');
}

export async function fetchMessage(id: string): Promise<Message> {
  return apiFetch<Message>(`/api/messages/${id}`);
}

export async function createMessage(data: Partial<Message>): Promise<Message> {
  return apiFetch<Message>('/api/messages', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Updates an existing message
 * @param id - The unique identifier of the message
 * @param data - Partial Message object containing the updated message details
 * @returns Promise containing the updated Message object
 * @throws Error if the message update fails
 */
export async function updateMessage(id: string, data: Partial<Message>): Promise<Message> {
  return apiFetch<Message>(`/api/messages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Deletes a message
 * @param id - The unique identifier of the message to delete
 * @returns Promise that resolves when the message is deleted
 * @throws Error if the message deletion fails
 */
export async function deleteMessage(id: string): Promise<void> {
  return apiFetch<void>(`/api/messages/${id}`, { method: 'DELETE' });
}

// Users API
export async function fetchUsers(): Promise<User[]> {
  return apiFetch<User[]>('/api/users');
}

export async function fetchUser(id: string): Promise<User> {
  return apiFetch<User>(`/api/users/${id}`);
}

export async function createUser(data: Partial<User>): Promise<User> {
  return apiFetch<User>('/api/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Updates an existing user
 * @param id - The unique identifier of the user
 * @param data - Partial User object containing the updated user details
 * @returns Promise containing the updated User object
 * @throws Error if the user update fails
 */
export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  return apiFetch<User>(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Deletes a user
 * @param id - The unique identifier of the user to delete
 * @returns Promise that resolves when the user is deleted
 * @throws Error if the user deletion fails
 */
export async function deleteUser(id: string): Promise<void> {
  return apiFetch<void>(`/api/users/${id}`, { method: 'DELETE' });
}

// Blog API
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  return apiFetch<BlogPost[]>('/api/blog');
}

export async function fetchBlogPost(slug: string): Promise<BlogPost> {
  return apiFetch<BlogPost>(`/api/blog/${slug}`);
}

/**
 * Creates a new blog post
 * @param data - Partial BlogPost object containing the new post details
 * @returns Promise containing the created BlogPost object
 * @throws Error if the blog post creation fails
 */
export async function createBlogPost(data: Partial<BlogPost>): Promise<BlogPost> {
  return apiFetch<BlogPost>('/api/blog', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Updates an existing blog post
 * @param slug - The unique slug of the blog post
 * @param data - Partial BlogPost object containing the updated post details
 * @returns Promise containing the updated BlogPost object
 * @throws Error if the blog post update fails
 */
export async function updateBlogPost(slug: string, data: Partial<BlogPost>): Promise<BlogPost> {
  return apiFetch<BlogPost>(`/api/blog/${slug}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Deletes a blog post
 * @param slug - The unique slug of the blog post to delete
 * @returns Promise that resolves when the blog post is deleted
 * @throws Error if the blog post deletion fails
 */
export async function deleteBlogPost(slug: string): Promise<void> {
  return apiFetch<void>(`/api/blog/${slug}`, { method: 'DELETE' });
}

// Auth API
/*export async function login(email: string, password: string): Promise<{ user: User }> {
  return apiFetch<{ user: User }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}*/

export async function signup(name: string, email: string, password: string): Promise<{ user: AuthUser }> {
  const res = await apiFetch<ApiResponse<AuthResponse>>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.success) {
    throw new Error(res.error?.message || 'Signup failed');
  }

  return { user: res.data!.user };
}

export async function logout(): Promise<{ message: string }> {
  const res = await apiFetch<ApiResponse<{ message: string }>>('/api/auth/logout', {
    method: 'POST',
  });

  if (!res.success) {
    throw new Error(res.error?.message || 'Logout failed');
  }

  return { message: res.data!.message };
}

export async function me(): Promise<{ user: AuthUser }> {
  const res = await apiFetch<ApiResponse<AuthResponse>>('/api/auth/me', {
    method: 'GET',
  });

  if (!res.success) {
    throw new Error(res.error?.message || 'Failed to fetch user');
  }

  return { user: res.data!.user };
}

export async function refresh(): Promise<{ user: AuthUser }> {
  const res = await apiFetch<ApiResponse<AuthResponse>>('/api/auth/refresh', {
    method: 'POST',
  });

  if (!res.success) {
    throw new Error(res.error?.message || 'Token refresh failed');
  }

  return { user: res.data!.user };
}