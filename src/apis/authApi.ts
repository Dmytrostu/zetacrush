// Auth-related API calls
import { api } from './apiConfig';

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
    trialActive: boolean;
    subscriptionActive: boolean;
  };
  token: string;
}

export const authApi = {
  signIn: async (credentials: SignInCredentials): Promise<AuthResponse> => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },
  
  signUp: async (credentials: SignUpCredentials): Promise<AuthResponse> => {
    const response = await api.post('/users/register', credentials);
    return response.data;
  },
  
  validateToken: async (): Promise<boolean> => {
    try {
      // This endpoint would validate the current token
      await api.get('/users/me');
      return true;
    } catch (error) {
      return false;
    }
  },
  
  logout: async (): Promise<void> => {
    try {
      // Optional: send logout request to server to invalidate token
      await api.post('/users/logout');
    } catch (error) {
      // Silently handle error
      console.error('Logout error:', error);
    }
  }
};
