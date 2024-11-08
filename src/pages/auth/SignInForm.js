import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const SignInForm = () => {
  const { setCurrentUser } = useCurrentUser();;
  const [signInData, setSignInData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
  
    try {
      const data = await authService.login(signInData);
      setCurrentUser(data.user);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error('Failed to sign in');
      setErrors(err.response?.data || { non_field_errors: ['An error occurred. Please try again.'] });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={signInData.username}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm
                ${errors.username ? 'border-red-500' : 'border-gray-300'}
                focus:ring-green-500 focus:border-green-500
              `}
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={signInData.password}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm
                ${errors.password ? 'border-red-500' : 'border-gray-300'}
                focus:ring-green-500 focus:border-green-500
              `}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {errors.non_field_errors?.map((error, idx) => (
            <div key={idx} className="text-sm text-red-500 text-center">
              {error}
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
              ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
            `}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="flex items-center justify-between mt-4">
            <Link
              to="/password/reset"
              className="text-sm text-green-600 hover:text-green-500"
            >
              Forgot password?
            </Link>
            <Link
              to="/signup"
              className="text-sm text-green-600 hover:text-green-500"
            >
              Don't have an account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;