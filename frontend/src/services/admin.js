import api from './api';

export const adminLogin = (data) => api.post('/admin/login', data);
export const adminProfile = () => api.get('/admin/profile');
export const adminLogout = () => api.post('/admin/logout');
export const adminForgotPassword = (data) => api.post('/admin/forgot-password', data); 