import api from './api';

export const getVehicles = (page = 1, limit = 12, search = "") =>
    api.get(`/vehicles?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
export const getVehicleById = async (id) => api.get(`/vehicles/${id}`);
export const addVehicle = (data) => api.post('/vehicles', data);
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);
export const updateVehicle = (id, data) => api.put(`/vehicles/${id}`, data); 