import api from './api';
import { AUTH_API, STORAGE_KEYS } from '../utils/constants';

/**
 * Extract & store auth data safely
 */
const storeAuthData = (data) => {
  if (!data?.user) return;

  // Save user
  localStorage.setItem(
    STORAGE_KEYS.USER,
    JSON.stringify(data.user)
  );

  // Save JWT token (or fallback if backend not sending yet)
  const token = data.token || data.jwt;
if (!token) throw new Error('Auth token missing from backend');
localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

export const authService = {

  /**
   * LOGIN
   */
  login: async (username, password) => {
    try {
      const response = await api.post(`${AUTH_API}/login`, {
        username,
        password
      });

      // Backend returns: { success, user, token }
      if (response.data?.user) {
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

  /**
   * REGISTER
   */
  register: async (userData) => {
    try {
      const response = await api.post(
        `${AUTH_API}/register`,
        userData
      );

      if (response.data?.user) {
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

  /**
   * LOGOUT
   */
  logout: (redirect = true) => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);

    if (redirect) {
      window.location.href = '/login';
    }
  },

  /**
   * CURRENT USER
   */
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  /**
   * AUTH CHECK
   */
  isAuthenticated: () => {
    return Boolean(localStorage.getItem(STORAGE_KEYS.TOKEN));
  },

  /**
   * ROLE CHECKS (✅ FIXED TO user.role)
   */
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'ADMIN';
  },

  isUser: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'USER';
  }
};