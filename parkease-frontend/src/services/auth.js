import api from './api';
import { AUTH_API, STORAGE_KEYS } from '../utils/constants';

/**
 * Extract & store auth data safely
 */
const storeAuthData = (data) => {
  if (!data?.user) return;

  localStorage.setItem(
    STORAGE_KEYS.USER,
    JSON.stringify(data.user)
  );

  // ⚠️ Replace with real token when backend is ready
  const token = data.token || 'demo-token';
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

      if (response.data?.success) {
        storeAuthData(response.data);
      }

      return response.data;

    } catch (error) {
      throw {
        message: error.message || 'Login failed',
        status: error.status
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

      if (response.data?.success) {
        storeAuthData(response.data);
      }

      return response.data;

    } catch (error) {
      throw {
        message: error.message || 'Registration failed',
        status: error.status
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
   * ROLE CHECKS
   */
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.userType === 'ADMIN';
  },

  isUser: () => {
    const user = authService.getCurrentUser();
    return user?.userType === 'USER';
  }
};