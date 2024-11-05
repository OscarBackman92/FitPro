// SignUpForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    
    if (formData.password1 !== formData.password2) {
      setErrors({ password2: 'Passwords must match' });
      setIsLoading(false);
      return;
    }

    try {
      await register(formData);
      navigate('/signin');
    } catch (err) {
      setErrors(err.response?.data || { non_field_errors: ['Registration failed. Please try again.'] });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      {['username', 'email', 'password1', 'password2'].map((field) => (
        <div key={field} className="flex flex-col space-y-1">
          <label htmlFor={field} className="text-gray-700 text-sm font-semibold">
            {field === 'password1' ? 'Password' : field === 'password2' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            type={field.includes('password') ? 'password' : 'text'}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            placeholder={`Enter your ${field === 'password1' ? 'password' : field === 'password2' ? 'password again' : field}`}
          />
          {errors[field] && <p className="text-red-500 text-xs">{errors[field]}</p>}
        </div>
      ))}

      {errors.non_field_errors && <p className="text-red-500 text-sm">{errors.non_field_errors}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-2 mt-4 rounded-md font-bold text-white transition ${
          isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
};

export default SignUpForm;
