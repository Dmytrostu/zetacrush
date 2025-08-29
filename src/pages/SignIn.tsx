import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi, SignInCredentials } from '../apis/authApi';
import { setAuthToken } from '../apis/apiConfig';
import { useAppContext } from '../state/context';
import './Auth.css';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAppContext();

  // Check for redirect message from another page
  const { state } = location as { state: { message?: string, from?: string } | null };
  const redirectMessage = state?.message;
  const redirectFrom = state?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const credentials: SignInCredentials = { email, password };
      const response = await authApi.signIn(credentials);
      
      // Set the auth token for future API calls
      setAuthToken(response.token);
      
      // Update user context
      setUser({
        id: response.user.id,
        email: response.user.email,
        token: response.token,
        trialActive: response.user.trialActive,
        subscriptionActive: response.user.subscriptionActive
      });

      // Redirect back to the page that required authentication
      navigate(redirectFrom);
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">Zetacrush</div>
          <h1 className="auth-title">Sign in</h1>
          <p className="auth-subtitle">to continue to Zetacrush</p>
          {redirectMessage && (
            <p className="form-error">{redirectMessage}</p>
          )}
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
