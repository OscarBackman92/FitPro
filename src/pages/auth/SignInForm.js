import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSetCurrentUser } from '../../contexts/CurrentUserContext';
import { login } from '../../services/authService';

const SignInForm = () => {
  const setCurrentUser = useSetCurrentUser();
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
      const data = await login(signInData);
      setCurrentUser(data.user);
      navigate('/');
    } catch (err) {
      setErrors(err.response?.data || { non_field_errors: ['An error occurred. Please try again.'] });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={signInData.username}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your username"
            />
            {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={signInData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>

          {errors.non_field_errors && <p className="text-sm text-red-500 mt-2 text-center">{errors.non_field_errors}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 text-white rounded-md font-bold transition ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-green-500 font-semibold hover:underline">
            Sign up now!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
