import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const bookingService = {
  createBooking: (bookingData) =>
    axios.post(`${API_URL}/bookings`, bookingData, getAuthHeader()),
  getUserBookings: (filters = {}) =>
    axios.get(`${API_URL}/bookings/user/my-bookings`, {
      params: filters,
      ...getAuthHeader(),
    }),
  getBookingById: (bookingId) =>
    axios.get(`${API_URL}/bookings/${bookingId}`, getAuthHeader()),
  updateBooking: (bookingId, data) =>
    axios.put(`${API_URL}/bookings/${bookingId}`, data, getAuthHeader()),
  cancelBooking: (bookingId, cancelReason) =>
    axios.post(`${API_URL}/bookings/${bookingId}/cancel`, { cancelReason }, getAuthHeader()),
};

export const tableService = {
  getAllTables: () => axios.get(`${API_URL}/tables`),
  getTableById: (tableId) => axios.get(`${API_URL}/tables/${tableId}`),
  getAvailableTables: (bookingDate, timeSlot, capacity) =>
    axios.get(`${API_URL}/tables/available`, {
      params: { bookingDate, timeSlot, capacity },
    }),
  getTableStatus: (tableId) => axios.get(`${API_URL}/tables/${tableId}/status`),
};

export const menuService = {
  getAllMenuItems: () => axios.get(`${API_URL}/menu`),
  getMenuByCategory: (category) => axios.get(`${API_URL}/menu/category/${category}`),
  searchMenuItems: (query) => axios.get(`${API_URL}/menu/search`, { params: { query } }),
  getMenuItemById: (itemId) => axios.get(`${API_URL}/menu/${itemId}`),
  getBestsellers: () => axios.get(`${API_URL}/menu/bestsellers`),
};

export const eventService = {
  getAllEvents: () => axios.get(`${API_URL}/events`),
  getEventById: (eventId) => axios.get(`${API_URL}/events/${eventId}`),
};

export const authService = {
  getProfile: () => axios.get('/api/auth/profile', getAuthHeader()),
  updateProfile: (data) =>
    axios.put('/api/auth/profile', data, getAuthHeader()),
  changePassword: (oldPassword, newPassword) =>
    axios.post(
      '/api/auth/change-password',
      { oldPassword, newPassword },
      getAuthHeader()
    ),
};

export const restaurantService = {
  getSettings: () => axios.get(`${API_URL}/restaurant`),
};
