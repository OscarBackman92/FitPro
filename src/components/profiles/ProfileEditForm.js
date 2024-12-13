import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Loader } from 'lucide-react';
import ProfileImageHandler from '../common/ProfileImageHandler';
import LoadingSpinner from '../common/LoadingSpinner';
import { profileService } from '../../services/profileService';
import toast from 'react-hot-toast';

const ProfileEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    weight: '',
    height: '',
    gender: '',
    date_of_birth: '',
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await profileService.getProfile(id);
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          weight: data.weight?.toString() || '',
          height: data.height?.toString() || '',
          gender: data.gender || '',
          date_of_birth: data.date_of_birth || '',
        });
      } catch (err) {
        toast.error('Failed to load profile');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id, navigate]);

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

  const validateForm = () => {
    const newErrors = {};

    if (formData.weight) {
      const weight = parseFloat(formData.weight);
      if (isNaN(weight) || weight < 0 || weight > 500) {
        newErrors.weight = 'Weight must be between 0 and 500 kg';
      }
    }

    if (formData.height) {
      const height = parseFloat(formData.height);
      if (isNaN(height) || height < 0 || height > 300) {
        newErrors.height = 'Height must be between 0 and 300 cm';
      }
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

    setIsSubmitting(true);
    try {
      // Create submission data including any image file
      const submissionData = {
        ...formData,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        profile_image: imageFile
      };

      await profileService.updateProfile(id, submissionData);
      toast.success('Profile updated successfully');
      navigate(`/profiles/${id}`);
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error('Failed to update profile');
      
      if (err.response?.data) {
        setErrors(err.response.data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between border-b border-gray-700 pb-6">
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          <ProfileImageHandler
            src={imageFile ? URL.createObjectURL(imageFile) : formData.profile_image}
            onChange={setImageFile}
            size={64}
            editable
          />
        </div>

        <div className="space-y-6">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg bg-gray-700 border border-gray-600 
                text-white px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Bio Input */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-lg bg-gray-700 border border-gray-600 
                text-white px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Weight and Height Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-300">
                Weight (kg)
              </label>
              <input
                type="text"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg bg-gray-700 border border-gray-600 
                  text-white px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {errors.weight && (
                <p className="mt-1 text-sm text-red-500">{errors.weight}</p>
              )}
            </div>

            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-300">
                Height (cm)
              </label>
              <input
                type="text"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg bg-gray-700 border border-gray-600 
                  text-white px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {errors.height && (
                <p className="mt-1 text-sm text-red-500">{errors.height}</p>
              )}
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-300">
              Date of Birth
            </label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg bg-gray-700 border border-gray-600 
                text-white px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-gray-400 hover:text-gray-300 flex items-center gap-2"
          >
            <X className="h-5 w-5" />
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors 
              flex items-center gap-2"
          >
            {isSubmitting ? (
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
      </form>
    </div>
  );
};

export default ProfileEditForm;