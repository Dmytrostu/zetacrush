import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../state/context';
import { isAuthenticated, getStoredAuthToken } from '../apis/apiConfig';
import { authApi } from '../apis/authApi';
import { userApi } from '../apis/userApi';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, setUser } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const validateAuth = async () => {
      // If user is already in context, we're authenticated
      if (user) {
        setIsValid(true);
        setLoading(false);
        return;
      }

      // Check if there's a token in localStorage
      const token = getStoredAuthToken();
      if (!token) {
        setIsValid(false);
        setLoading(false);
        return;
      }

      try {
        // Validate token with backend
        const isTokenValid = await authApi.validateToken();
        setIsValid(isTokenValid);        // If valid, try to get user profile
        if (isTokenValid) {
          try {
            // Fetch actual user profile from API
            const userProfile = await userApi.getProfile();
            setUser({
              id: userProfile.id,
              email: userProfile.email,
              token,
              trialActive: userProfile.trialActive,
              subscriptionActive: userProfile.subscriptionActive,
            });
          } catch (profileError) {
            // If profile fetch fails, set minimal user info
            setUser({
              id: 'user_id',
              email: 'user@example.com',
              token,
              trialActive: true,
              subscriptionActive: false,
            });
          }
        }
      } catch (error) {
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    };

    validateAuth();
  }, [user, setUser]);

  if (loading) {
    // Show loading state
    return (
      <div className="auth-container">
        <div className="loading-indicator">
          <div className="loading-spinner" style={{ width: '2rem', height: '2rem' }}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    // Redirect to login if not authenticated
    return (
      <Navigate 
        to="/signin" 
        state={{ 
          message: "Please sign in to continue", 
          from: location.pathname 
        }} 
        replace 
      />
    );
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;
