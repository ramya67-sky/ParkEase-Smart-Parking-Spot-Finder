import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

/**
 * Toggle this to false in production
 */
const DEBUG = true;

/**
 * Create axios instance
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * REQUEST INTERCEPTOR
 * - Attaches JWT token if available
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (DEBUG) {
      console.log('[API REQUEST]', {
        url: config.url,
        method: config.method,
        data: config.data
      });
    }

    return config;
  },
  (error) => {
    if (DEBUG) {
      console.error('[API REQUEST ERROR]', error);
    }
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * - Handles global errors
 * - Handles token expiration
 */
api.interceptors.response.use(
  (response) => {
    if (DEBUG) {
      console.log('[API RESPONSE]', {
        url: response.config.url,
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    // Network / Server Down
    if (!error.response) {
      console.error('[NETWORK ERROR] Backend not reachable');
      return Promise.reject({
        message: 'Server not reachable. Please try again later.'
      });
    }

    const { status, data } = error.response;

    if (DEBUG) {
      console.error('[API RESPONSE ERROR]', {
        status,
        data
      });
    }

    // Unauthorized → Logout
    if (status === 401) {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);

      // Prevent reload loop
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Extract backend message safely
    const errorMessage =
      data?.message ||
      data?.error ||
      'Something went wrong. Please try again.';

    return Promise.reject({
      status,
      message: errorMessage
    });
  }
);

export default api;