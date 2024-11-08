// src/pages/auth/SignUpForm.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';
import toast from 'react-hot-toast';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Client-side validation
    if (formData.password !== formData.password_confirm) {
      setErrors({ password_confirm: 'Passwords must match' });
      setIsLoading(false);
      return;
    }

    try {
      await register(formData);
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/signin');
    } catch (err) {
      setErrors(err.response?.data || {
        non_field_errors: ['Registration failed. Please try again.']
      });
      toast.error(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'Choose a username'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email'
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Choose a password'
    },
    {
      name: 'password_confirm',
      label: 'Confirm Password',
      type: 'password',
      placeholder: 'Confirm your password'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">Create Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {formFields.map((field) => (
            <div key={field.name}>
              <label 
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                id={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className={`mt-1 block w-full rounded-md shadow-sm
                  ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}
                  focus:ring-green-500 focus:border-green-500
                `}
              />
              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-500">{errors[field.name]}</p>
              )}
            </div>
          ))}

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
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          <div className="text-center mt-4">
            <Link
              to="/signin"
              className="text-sm text-green-600 hover:text-green-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;