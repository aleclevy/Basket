import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await register(username, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to register');
    }
  };

  return (
    <div className='auth-wrapper'>
      <div className='auth-container fade-in'>
        <h2>Create Account</h2>
        {error && <div className='error'>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='username' className='sr-only'>
              Username
            </label>
            <input
              id='username'
              type='text'
              placeholder='Choose a username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete='username'
            />
          </div>
          <div className='form-group'>
            <label htmlFor='reg-email' className='sr-only'>
              Email
            </label>
            <input
              id='reg-email'
              type='email'
              placeholder='Email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete='email'
            />
          </div>
          <div className='form-group'>
            <label htmlFor='reg-password' className='sr-only'>
              Password
            </label>
            <input
              id='reg-password'
              type='password'
              placeholder='Create a password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete='new-password'
              minLength={6}
            />
          </div>
          <button type='submit' className='primary'>
            Create Account
          </button>
        </form>
        <p>
          Already have an account?<Link to='/login'>Sign in</Link>
        </p>
      </div>
    </div>
  );
};
