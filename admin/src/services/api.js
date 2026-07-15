import axios from 'axios';

// In production: VITE_API_URL = https://your-server.vercel.app/api
// In local dev: falls back to '/api' (vite proxy handles it → localhost:5000)
const API_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('admin_token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const adminAuthService = {
  login: (email, password) =>
    axios.post(`${API_URL}/auth/login`, { email, password }),
  getProfile: () =>
    axios.get(`${API_URL}/auth/profile`, getAuthHeader()),
};

export const adminBookingService = {
  getAllBookings: (filters = {}) =>
    axios.get(`${API_URL}/bookings`, {
      params: filters,
      ...getAuthHeader(),
    }),
  getBookingById: (bookingId) =>
    axios.get(`${API_URL}/bookings/${bookingId}`, getAuthHeader()),
  getBookingStats: () =>
    axios.get(`${API_URL}/bookings/stats/overview`, getAuthHeader()),
  updateBookingStatus: (bookingId, status) =>
    axios.put(`${API_URL}/bookings/${bookingId}`, { status }, getAuthHeader()),
};

export const adminTableService = {
  getAllTables: () =>
    axios.get(`${API_URL}/tables`, getAuthHeader()),
  getTableStatus: (tableId) =>
    axios.get(`${API_URL}/tables/${tableId}/status`, getAuthHeader()),
  createTable: (data) =>
    axios.post(`${API_URL}/tables`, data, getAuthHeader()),
  updateTable: (tableId, data) =>
    axios.put(`${API_URL}/tables/${tableId}`, data, getAuthHeader()),
  deleteTable: (tableId) =>
    axios.delete(`${API_URL}/tables/${tableId}`, getAuthHeader()),
};

export const adminMenuService = {
  getAllMenuItems: () =>
    axios.get(`${API_URL}/menu`, getAuthHeader()),
  createMenuItem: (data) =>
    axios.post(`${API_URL}/menu`, data, getAuthHeader()),
  updateMenuItem: (itemId, data) =>
    axios.put(`${API_URL}/menu/${itemId}`, data, getAuthHeader()),
  deleteMenuItem: (itemId) =>
    axios.delete(`${API_URL}/menu/${itemId}`, getAuthHeader()),
};

export const adminPriceMenuService = {
  getAll: () => axios.get(`${API_URL}/price-menu/admin/all`, getAuthHeader()),
  create: (data) => axios.post(`${API_URL}/price-menu`, data, getAuthHeader()),
  update: (itemId, data) => axios.put(`${API_URL}/price-menu/${itemId}`, data, getAuthHeader()),
  remove: (itemId) => axios.delete(`${API_URL}/price-menu/${itemId}`, getAuthHeader()),
};

export const adminUploadService = {
  uploadImage: (base64Image) =>
    axios.post(`${API_URL}/upload`, { image: base64Image }, getAuthHeader()),
};

export const adminEventService = {
  getAllEvents: (adminMode = true) =>
    axios.get(`${API_URL}/events?admin=${adminMode}`, getAuthHeader()),
  createEvent: (data) =>
    axios.post(`${API_URL}/events`, data, getAuthHeader()),
  updateEvent: (eventId, data) =>
    axios.put(`${API_URL}/events/${eventId}`, data, getAuthHeader()),
  deleteEvent: (eventId) =>
    axios.delete(`${API_URL}/events/${eventId}`, getAuthHeader()),
};

export const adminRestaurantService = {
  getSettings: () =>
    axios.get(`${API_URL}/restaurant`, getAuthHeader()),
  updateSettings: (data) =>
    axios.put(`${API_URL}/restaurant`, data, getAuthHeader()),
};
