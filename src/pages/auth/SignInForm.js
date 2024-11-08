// src/pages/auth/SignInForm.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const SignInForm = () => {
  const { setCurrentUser } = useCurrentUser();
  const [signInData, setSignInData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Log attempt
      console.log('Attempting login with:', { username: signInData.username });
      
      const data = await authService.login(signInData);
      
      // Log successful response
      console.log('Login response:', data);

      if (data.user && data.token) {
        // Set the user in context
        setCurrentUser(data.user);
        // Store token
        localStorage.setItem('token', data.token);
        
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.message || 'Failed to sign in');
      setErrors(err.response?.data || {
        non_field_errors: ['Invalid username or password']
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Sign In</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={signInData.username}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 ${
                errors.username ? 'border-red-500' : ''
              }`}
              required
            />
            {errors.username?.map((message, idx) => (
              <p key={idx} className="mt-1 text-sm text-red-600">
                {message}
              </p>
            ))}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={signInData.password}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 ${
                errors.password ? 'border-red-500' : ''
              }`}
              required
            />
            {errors.password?.map((message, idx) => (
              <p key={idx} className="mt-1 text-sm text-red-600">
                {message}
              </p>
            ))}
          </div>

          {errors.non_field_errors?.map((message, idx) => (
            <p key={idx} className="text-sm text-red-600 text-center">
              {message}
            </p>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-sm text-center mt-4">
            <Link to="/signup" className="font-medium text-green-600 hover:text-green-500">
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;