import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  const sessionKey = localStorage.getItem('session_key');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (sessionKey) config.headers['X-Session-Key'] = sessionKey;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh/`, { refresh });
          localStorage.setItem('access_token', data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
    }
    return Promise.reject(error);
  }
);

export const getProducts = (params) => api.get('/products/', { params });
export const getProduct = (slug) => api.get(`/products/${slug}/`);
export const getFeaturedProducts = () => api.get('/products/featured/');
export const getCategories = () => api.get('/categories/');

export const getCart = () => api.get('/cart/');
export const addToCart = (productId, quantity = 1) =>
  api.post('/cart/add/', { product_id: productId, quantity });
export const updateCartItem = (itemId, quantity) =>
  api.post('/cart/update_item/', { item_id: itemId, quantity });
export const removeFromCart = (itemId) =>
  api.post('/cart/remove/', { item_id: itemId });
export const clearCart = () => api.post('/cart/clear/');

export const checkout = (data) => api.post('/orders/checkout/', data);
export const createRazorpayOrder = (data) => api.post('/orders/razorpay/create-order/', data);
export const verifyRazorpayPayment = (data) => api.post('/orders/razorpay/verify/', data);
export const getOrders = () => api.get('/orders/');
export const getOrder = (id) => api.get(`/orders/${id}/`);

export const login = (username, password) =>
  api.post('/auth/login/', { username, password });
export const register = (data) => api.post('/auth/register/', data);
export const getProfile = () => api.get('/auth/profile/');

export const toggleWishlist = (productId) =>
  api.post('/wishlist/toggle/', { product_id: productId });
export const getWishlist = () => api.get('/wishlist/');

export default api;
