import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSetCurrentUser } from '../../contexts/CurrentUserContext';
import { Save, X, Loader, Upload } from 'lucide-react';
import { axiosReq } from '../../services/axiosDefaults';
import toast from 'react-hot-toast';

const ProfileEditForm = () => {
  const { id } = useParams(); // Get the profile ID from the URL parameters
  const navigate = useNavigate(); // Hook to navigate programmatically
  const setCurrentUser = useSetCurrentUser(); // Hook to set the current user context

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    date_of_birth: '',
    gender: '',
    weight: '',
    height: '',
  });

  // Image handling
  const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image file
  const [previewImage, setPreviewImage] = useState(''); // State to store the preview URL of the selected image

  // UI state
  const [loading, setLoading] = useState(true); // State to indicate if the profile data is being loaded
  const [saving, setSaving] = useState(false); // State to indicate if the form is being saved
  const [errors, setErrors] = useState({}); // State to store form validation errors

  // Load initial profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data } = await axiosReq.get(`/api/profiles/${id}/`); // Fetch profile data from the API
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          date_of_birth: data.date_of_birth || '',
          gender: data.gender || '',
          weight: data.weight || '',
          height: data.height || '',
        });
        setPreviewImage(data.profile_image ? `${data.profile_image}?${Date.now()}` : ''); // Set the preview image URL
      } catch (err) {
        toast.error('Could not load profile data'); // Show error toast if profile data could not be loaded
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchProfileData();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be smaller than 2MB'); // Show error toast if image size is greater than 2MB
        return;
      }
      setSelectedImage(file); // Set the selected image file
      setPreviewImage(URL.createObjectURL(file)); // Set the preview image URL
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (formData.weight && (formData.weight < 0 || formData.weight > 500)) {
      newErrors.weight = 'Weight must be between 0 and 500 kg'; // Validate weight
    }

    if (formData.height && (formData.height < 0 || formData.height > 300)) {
      newErrors.height = 'Height must be between 0 and 300 cm'; // Validate height
    }

    if (formData.date_of_birth) {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      if (birthDate > today) {
        newErrors.date_of_birth = 'Date of birth cannot be in the future'; // Validate date of birth
      }
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please check form errors'); // Show error toast if there are validation errors
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      const submitData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          submitData.append(key, value); // Append form data to FormData object
        }
      });

      if (selectedImage) {
        submitData.append('profile_image', selectedImage); // Append selected image to FormData object
      }

      const response = await axiosReq.put(`/api/profiles/${id}/`, submitData); // Send PUT request to update profile

      setCurrentUser(prevUser => ({
        ...prevUser,
        profile_image: response.data.profile_image,
        profile: {
          ...prevUser.profile,
          ...response.data,
        }
      }));

      toast.success('Profile updated successfully'); // Show success toast
      setTimeout(() => {
        navigate(`/profiles/${id}`); // Navigate to the profile page after a short delay
      }, 500);
    } catch (err) {
      const responseErrors = err.response?.data;
      if (err.response?.status === 413) {
        toast.error('Image file is too large'); // Show error toast if image file is too large
      } else if (responseErrors) {
        if (typeof responseErrors === 'string') {
          toast.error(responseErrors); // Show error toast if response error is a string
        } else if (typeof responseErrors === 'object') {
          setErrors(responseErrors);
          const firstError = Object.values(responseErrors)[0];
          const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
          toast.error(errorMessage || 'Failed to update profile'); // Show error toast if response error is an object
        }
      } else {
        toast.error('Network error occurred. Please try again.'); // Show error toast if there is a network error
      }
    } finally {
      setSaving(false); // Set saving to false after submission
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <form 
        onSubmit={handleSubmit} 
        className="max-w-2xl mx-auto space-y-6 bg-gray-800 rounded-lg p-6 shadow-xl"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700">
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-2 bg-green-500 rounded-full cursor-pointer hover:bg-green-600 transition-colors">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageSelect}
              />
              <Upload className="h-5 w-5 text-white" />
            </label>
          </div>
          {errors?.profile_image && (
            <p className="text-red-500 text-sm">{errors.profile_image}</p>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg bg-gray-700 border border-gray-600 
                text-white px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Your name"
            />
            {errors?.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-lg bg-gray-700 border border-gray-600 
                text-white px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Tell us about yourself"
            />
            {errors?.bio && (
              <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
            )}
          </div>

          {/* Height and Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg bg-gray-700 border border-gray-600 
                  text-white px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {errors?.height && (
                <p className="text-red-500 text-sm mt-1">{errors.height}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg bg-gray-700 border border-gray-600 
                  text-white px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {errors?.weight && (
                <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
              )}
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg bg-gray-700 border border-gray-600 
                text-white px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {errors?.date_of_birth && (
              <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg bg-gray-700 border border-gray-600 
                text-white px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
            {errors?.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={saving}
              className="px-4 py-2 text-gray-400 hover:text-gray-300 flex items-center gap-2 
                disabled:opacity-50"
            >
              <X className="h-5 w-5" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors 
                flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;