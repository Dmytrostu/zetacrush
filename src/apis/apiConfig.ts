// Base API configuration
import axios from 'axios';

// export const API_BASE_URL = 'https://zetacrush-backend-wcwl.vercel.app/api/v1';
export const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set auth token in axios headers
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Store token in localStorage for persistence across page reloads
    localStorage.setItem('auth_token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    // Remove token from localStorage
    localStorage.removeItem('auth_token');
  }
};

// Function to get auth token from localStorage
export const getStoredAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Function to check if token exists
export const isAuthenticated = (): boolean => {
  return !!getStoredAuthToken();
};

// Add response interceptor to handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear the token
      setAuthToken(null);
      
      // Redirect to sign-in page if not already there
      if (!window.location.pathname.includes('/signin')) {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

// Initialize token from localStorage on app startup
const initializeAuth = () => {
  const token = getStoredAuthToken();
  if (token) {
    setAuthToken(token);
  }
};

// Run initialization
initializeAuth();
