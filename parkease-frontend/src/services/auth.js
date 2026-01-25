import api from './api';
import { AUTH_API, STORAGE_KEYS } from '../utils/constants';

/**
 * Store auth data safely in localStorage
 */
const storeAuthData = (data) => {
  if (!data?.user || !data?.token) return;

  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
  localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
};

export const authService = {

  // ---------------- LOGIN ----------------
  login: async ({ email, password }) => {
    try {
      const response = await api.post(`${AUTH_API}/login`, { email, password });

      if (response.data?.success) {
        storeAuthData(response.data);
      }

      return response.data;

    } catch (error) {
      throw {
        message: error?.response?.data?.message || 'Login failed',
        status: error?.response?.status
      };
    }
  },

  // ---------------- REGISTER ----------------
  register: async (userData) => {
    try {
      const response = await api.post(`${AUTH_API}/register`, userData);

      if (response.data?.success) {
        storeAuthData(response.data);
      }

      return response.data;

    } catch (error) {
      throw {
        message: error?.response?.data?.message || 'Registration failed',
        status: error?.response?.status
      };
    }
  },

  // ---------------- LOGOUT ----------------
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    window.location.href = '/login';
  },

  // ---------------- CURRENT USER ----------------
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  // ---------------- AUTH CHECK ----------------
  isAuthenticated: () => !!localStorage.getItem(STORAGE_KEYS.TOKEN),

  // ---------------- ROLE CHECK ----------------
  isAdmin: () => authService.getCurrentUser()?.role === 'ADMIN',
  isUser: () => authService.getCurrentUser()?.role === 'USER',
};