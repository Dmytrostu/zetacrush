// User subscription and profile API calls
import { api } from './apiConfig';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  trialActive: boolean;
  subscriptionActive: boolean;
  subscriptionExpiresAt?: string;
}

export const userApi = {
  /**
   * Get the current user's profile
   */
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/users/me');
    return response.data;
  },
  
  /**
   * Check if the user's subscription is active
   */
  checkSubscription: async (): Promise<{
    trialActive: boolean;
    subscriptionActive: boolean;
    expiresAt?: string;
  }> => {
    const response = await api.get('/users/subscription');
    return response.data;
  },
  
  /**
   * Update user profile information
   */
  updateProfile: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.put('/users/profile', profile);
    return response.data;
  }
};
