import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import  { authService } from '../../services/authService';
import { 
  UserPlus, Loader, Mail, Lock, User, 
  AlertCircle, CheckCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password1) {
      newErrors.password1 = 'Password is required';
    } else if (formData.password1.length < 8) {
      newErrors.password1 = 'Password must be at least 8 characters';
    }

    if (!formData.password2) {
      newErrors.password2 = 'Please confirm your password';
    } else if (formData.password1 !== formData.password2) {
      newErrors.password2 = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const data = {
        username: formData.username,
        email: formData.email,
        password1: formData.password1,
        password2: formData.password2
      };
      
      console.log('Registration payload:', data);
      const response = await authService.register(data);
      console.log('Registration response:', response);
      
      toast.success('Account created successfully! Please sign in.');
      navigate('/signin');
    } catch (err) {
      console.error('Registration error:', err);
      console.log('Error details:', err.response?.data);
      
      // Handle different types of errors
      if (err.response?.data) {
        // Handle Django REST API error format
        const serverErrors = {};
        Object.entries(err.response.data).forEach(([key, value]) => {
          serverErrors[key] = Array.isArray(value) ? value[0] : value;
        });
        setErrors(serverErrors);
      } else {
        setErrors({
          general: 'Registration failed. Please try again later.'
        });
      }
      
      toast.error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      uppercase: /[A-Z]/.test(password),
    };

    return checks;
  };

  const checks = passwordStrength(formData.password1);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo/Brand Section */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-500/20 p-3 rounded-xl">
            <UserPlus className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link 
            to="/signin" 
            className="font-semibold text-green-500 hover:text-green-400 transition-colors"
          >
            Sign in
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
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-10 bg-gray-700 border border-gray-600 rounded-lg 
                    py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Choose a username"
                />
              </div>
              {errors.username && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-300"
              >
                Email
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
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 bg-gray-700 border border-gray-600 rounded-lg 
                    py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {errors.email}
                </p>
              )}
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
                  id="password1"
                  name="password1"
                  type="password"
                  required
                  value={formData.password1}
                  onChange={handleChange}
                  className="block w-full pl-10 bg-gray-700 border border-gray-600 rounded-lg 
                    py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Create a password"
                />
              </div>
              {errors.password1 && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {errors.password1}
                </p>
              )}

              {/* Password Strength Indicators */}
              {formData.password1 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-300">Password strength:</p>
                  <div className="space-y-2">
                    {Object.entries(checks).map(([key, valid]) => (
                      <div 
                        key={key} 
                        className={`flex items-center gap-2 text-sm ${
                          valid ? 'text-green-500' : 'text-gray-400'
                        }`}
                      >
                        {valid ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        {key === 'length' && 'At least 8 characters'}
                        {key === 'number' && 'Contains a number'}
                        {key === 'special' && 'Contains a special character'}
                        {key === 'uppercase' && 'Contains an uppercase letter'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                  onChange={handleChange}
                  className="block w-full pl-10 bg-gray-700 border border-gray-600 rounded-lg 
                    py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                />
              </div>
              {errors.password2 && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {errors.password2}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-green-500 
                  focus:ring-green-500 focus:ring-offset-gray-800 mt-1"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                I agree to the{' '}
                <Link 
                  to="/terms" 
                  className="text-green-500 hover:text-green-400"
                >
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link 
                  to="/privacy" 
                  className="text-green-500 hover:text-green-400"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* General Error Message */}
            {errors.general && (
              <div className="bg-red-500/10 text-red-500 p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm">{errors.general}</p>
              </div>
            )}

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
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  Create account
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;