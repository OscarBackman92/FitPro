import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import authService from '../../services/authService';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  // State to store the email input
  const [email, setEmail] = useState('');
  // State to manage loading state
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Call the forgotPassword service with the email
      await authService.forgotPassword(email);
      // Show success message
      toast.success('Password reset instructions sent to your email');
    } catch (err) {
      // Show error message
      toast.error('Failed to process password reset request');
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-white">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 bg-gray-700 border border-gray-600 rounded-lg 
                    py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
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
              {isLoading ? 'Processing...' : 'Send Reset Instructions'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
