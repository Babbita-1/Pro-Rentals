import api from './api';

export const getBookings = () => api.get('/bookings');
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const createBooking = (data) => api.post('/bookings', data);
export const updateBookingStatus = (id, status) => api.put(`/bookings/${id}/status`, { status });
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);
export const getMyItemBookings = () => api.get('/bookings/my-items');
export const getMyBookings = () => api.get('/bookings/my-bookings');
export const getAdminStats = () => api.get('/bookings/admin-stats');
export const getAllBookingsAdmin = () => api.get('/bookings/admin-all');
export const adminUpdateBookingStatus = (id, status) => api.put(`/bookings/admin-status/${id}`, { status });
export const getMyVehicleBookings = () => api.get('/bookings/my-vehicles'); 