import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSetCurrentUser } from '../../contexts/CurrentUserContext';
import authService from '../../services/authService';
import { User, Lock, Loader, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignInForm() {
  const setCurrentUser = useSetCurrentUser();
  const navigate = useNavigate();
  const [signInData, setSignInData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignInData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // First, attempt to login
      await authService.login(signInData);

      // After successful login, get user details
      try {
        const userResponse = await authService.getCurrentUser();
        setCurrentUser(userResponse);
        toast.success('Welcome back!');
        navigate('/dashboard');
      } catch (userError) {
        // If we can't get user details, clear everything and show error
        authService.clearToken();
        setCurrentUser(null);
        throw new Error('Unable to get user details. Please try logging in again.');
      }
    } catch (err) {
      if (err.response?.data) {
        const errorData = err.response.data;
        setErrors(typeof errorData === 'object' ? errorData : { non_field_errors: [errorData] });
        toast.error(errorData.non_field_errors?.[0] || 'Invalid username or password');
      } else {
        setErrors({ non_field_errors: [err.message || 'An error occurred during sign in'] });
        toast.error(err.message || 'Failed to sign in');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-white">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link 
            to="/signup" 
            className="font-semibold text-green-500 hover:text-green-400 transition-colors"
          >
            Sign up for free
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username Input */}
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-gray-300"
              >
                Username
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={signInData.username}
                  onChange={handleChange}
                  className="block w-full pl-10 bg-gray-700 border border-gray-600 rounded-lg 
                    py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter your username"
                />
              </div>
              {errors.username?.map((message, idx) => (
                <p key={idx} className="mt-2 text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {message}
                </p>
              ))}
            </div>

            {/* Password Input */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={signInData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 bg-gray-700 border border-gray-600 rounded-lg 
                    py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
              </div>
              {errors.password?.map((message, idx) => (
                <p key={idx} className="mt-2 text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {message}
                </p>
              ))}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-green-500 
                    focus:ring-green-500 focus:ring-offset-gray-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link 
                  to="/forgot-password" 
                  className="font-medium text-green-500 hover:text-green-400 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Error Messages */}
            {errors.non_field_errors?.map((message, idx) => (
              <div key={idx} className="bg-red-500/10 text-red-500 p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm">{message}</p>
              </div>
            ))}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 px-4 py-2 
                border border-transparent rounded-lg shadow-sm text-base font-medium 
                text-white bg-green-500 hover:bg-green-600 focus:outline-none 
                focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
                disabled:opacity-50 disabled:cursor-not-allowed transition-all
                focus:ring-offset-gray-800"
            >
              {isLoading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
