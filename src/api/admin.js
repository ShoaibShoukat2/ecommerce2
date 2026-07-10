import api from './index';

export const getAdminDashboard = () => api.get('/admin/dashboard/');
export const getAdminProducts = (params) => api.get('/admin/products/', { params });
export const createAdminProduct = (data) => api.post('/admin/products/', data);
export const updateAdminProduct = (id, data) => api.patch(`/admin/products/${id}/`, data);
export const deleteAdminProduct = (id) => api.delete(`/admin/products/${id}/`);
export const updateProductStock = (id, stock) => api.patch(`/admin/products/${id}/stock/`, { stock });

export const getAdminCategories = () => api.get('/admin/categories/');
export const createAdminCategory = (data) => api.post('/admin/categories/', data);
export const updateAdminCategory = (id, data) => api.patch(`/admin/categories/${id}/`, data);
export const deleteAdminCategory = (id) => api.delete(`/admin/categories/${id}/`);

export const getAdminOrders = (params) => api.get('/admin/orders/', { params });
export const updateAdminOrderStatus = (id, status) => api.patch(`/admin/orders/${id}/`, { status });

export const getAdminUsers = () => api.get('/admin/users/');
