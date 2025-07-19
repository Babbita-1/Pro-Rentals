import api from './api';

export const getItems = (page = 1, limit = 12, search = "") =>
  api.get(`/items?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
export const getItemById = (id) => api.get(`/items/${id}`);
export const createItem = (data) => api.post('/items', data);
export const updateItem = (id, data) => api.put(`/items/${id}`, data);
export const deleteItem = (id) => api.delete(`/items/${id}`);
export const getMyItems = () => api.get('/items/my');