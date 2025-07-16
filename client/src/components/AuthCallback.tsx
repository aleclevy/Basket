import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuthToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Store token and redirect to dashboard
      localStorage.setItem('token', token);
      setAuthToken(token);
      navigate('/dashboard');
    } else {
      // No token, redirect to login
      navigate('/login');
    }
  }, [navigate, searchParams, setAuthToken]);

  return (
    <div className='loading-container'>
      <div className='loading'></div>
      <p className='loading-text'>Completing sign in...</p>
    </div>
  );
};
