import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import  authService from '../../services/authService';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [formData, setFormData] = useState({
    password1: '',
    password2: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password1 !== formData.password2) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(token, formData.password1);
      toast.success('Password reset successful');
      navigate('/signin');
    } catch (err) {
      toast.error('Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-white">
          Set New Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Enter your new password below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* New Password Input */}
            <div>
              <label
                htmlFor="password1"
                className="block text-sm font-medium text-gray-300"
              >
                New Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password1"
                  name="password1"
                  type="password"
                  required
                  value={formData.password1}
                  onChange={(e) =>
                    setFormData({ ...formData, password1: e.target.value })
                  }
                  className="block w-full pl-10 bg-gray-700 border border-gray-600 rounded-lg 
                    py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="New password"
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="password2"
                className="block text-sm font-medium text-gray-300"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password2"
                  name="password2"
                  type="password"
                  required
                  value={formData.password2}
                  onChange={(e) =>
                    setFormData({ ...formData, password2: e.target.value })
                  }
                  className="block w-full pl-10 bg-gray-700 border border-gray-600 rounded-lg 
                    py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

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
              {isLoading ? 'Processing...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
