import axios from 'axios';

const API_BASE_URL = 'http://localhost:4444';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  signup: (data: { firstName: string; lastName: string; email: string; password: string }) =>
    api.post('/auth/signup', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  getCurrentUser: () => api.get('/auth/singleUser'),

  googleLogin: () => window.location.href = `${API_BASE_URL}/auth/google`,
};

// Product APIs
export const productAPI = {
  getProducts: () => api.get('/api/product'),

  createProduct: (data: { productName: string }) =>
    api.post('/api/productPost', data),
};

// Cart APIs
export const cartAPI = {
  getCart: () => api.get('/api/cart'),

  addToCart: (data: { productId: string; quantity: number }) =>
    api.post('/api/cart/add', data),

  updateCartItem: (itemId: string, data: { quantity: number }) =>
    api.put(`/api/cart/item/${itemId}`, data),

  removeFromCart: (itemId: string) =>
    api.delete(`/api/cart/item/${itemId}`),

  clearCart: () => api.delete('/api/cart'),

  checkout: (data: { shippingAddress: string; paymentMethod: string }) =>
    api.post('/api/cart/checkout', data),
};

// Order APIs
export const orderAPI = {
  getOrders: () => api.get('/api/orders'),

  getOrderById: (id: string) => api.get(`/api/orders/${id}`),

  getAllOrders: () => api.get('/api/orders/all'),

  updateOrderStatus: (id: string, data: { status: string }) =>
    api.put(`/api/orders/${id}/status`, data),

  cancelOrder: (id: string) => api.post(`/api/orders/${id}/cancel`),
};

export default api;