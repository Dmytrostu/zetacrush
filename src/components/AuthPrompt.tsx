import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPrompt.css';

interface AuthPromptProps {
  message?: string;
}

const AuthPrompt: React.FC<AuthPromptProps> = ({ 
  message = "Please sign in to upload books"
}) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/signin', { state: { from: '/', message } });
  };

  const handleRegister = () => {
    navigate('/register', { state: { from: '/' } });
  };

  return (
    <div className="auth-prompt">
      <div className="auth-prompt-content">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="auth-prompt-icon">
          <path d="M12 4a8 8 0 100 16 8 8 0 000-16zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12z" fill="currentColor"/>
          <path d="M12 14a1 1 0 01-1-1V7a1 1 0 112 0v6a1 1 0 01-1 1zM12 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="currentColor"/>
        </svg>
        <p className="auth-prompt-message">{message}</p>
        <div className="auth-prompt-buttons">
          <button 
            className="auth-prompt-button auth-prompt-primary"
            onClick={handleSignIn}
          >
            Sign in
          </button>
          <button 
            className="auth-prompt-button auth-prompt-secondary"
            onClick={handleRegister}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPrompt;
