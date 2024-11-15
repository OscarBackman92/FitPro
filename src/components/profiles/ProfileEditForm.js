import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { profileService } from '../../services/profileService';
import { 
  Camera, 
  Save,
  User, 
  Calendar, 
  Scale,
  RulerIcon as Height
} from 'lucide-react';
import Avatar from '../common/Avatar';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const FormField = ({ label, error, children }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-300">
      {label}
    </label>
    {children}
    {error && (
      <p className="text-sm text-red-500 mt-1">{error}</p>
    )}
  </div>
);

const ProfileEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    weight: '',
    height: '',
    gender: '',
    date_of_birth: '',
    location: '',
    profile_image: null
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await profileService.getProfile(id);
        setFormData({
          name: profile.name || '',
          bio: profile.bio || '',
          weight: profile.weight || '',
          height: profile.height || '',
          gender: profile.gender || '',
          date_of_birth: profile.date_of_birth || '',
          location: profile.location || '',
          profile_image: profile.profile_image || null
        });
        
        // Set preview if profile image exists
        if (profile.profile_image) {
          setPreviewImage(profile.profile_image);
        }
      } catch (err) {
        toast.error('Failed to load profile');
        navigate('/profile');
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
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a JPEG, PNG, or WebP image');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    setFormData(prev => ({
      ...prev,
      profile_image: file
    }));

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.bio?.length > 500) {
      newErrors.bio = 'Bio cannot exceed 500 characters';
    }

    if (formData.weight && (formData.weight < 0 || formData.weight > 500)) {
      newErrors.weight = 'Weight must be between 0 and 500 kg';
    }

    if (formData.height && (formData.height < 0 || formData.height > 300)) {
      newErrors.height = 'Height must be between 0 and 300 cm';
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

    setSaving(true);
    try {
      const updatedProfile = await profileService.updateProfile(id, formData);
      
      setCurrentUser(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...updatedProfile,
        },
      }));

      toast.success('Profile updated successfully');
      navigate(`/profiles/${id}`);
    } catch (err) {
      toast.error('Failed to update profile');
      if (err.response?.data) {
        setErrors(err.response.data);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner centered />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 rounded-lg shadow-xl p-6">
        {/* Header with Image Upload */}
        <div className="flex items-center justify-between border-b border-gray-700 pb-6">
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          
          <div className="relative">
            <div className="relative w-24 h-24">
              <Avatar
                src={previewImage || currentUser?.profile?.profile_image}
                text={currentUser?.username}
                size="xl"
                className="w-24 h-24"
              />
              <label className="absolute bottom-0 right-0 p-1.5 bg-green-500 rounded-full 
                cursor-pointer hover:bg-green-600 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Camera className="h-4 w-4 text-white" />
              </label>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Name */}
          <FormField label="Name" error={errors.name}>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                  text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>
          </FormField>

          {/* Bio */}
          <FormField label="Bio" error={errors.bio}>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Tell us about yourself..."
              maxLength={500}
            />
            <p className="text-sm text-gray-400 mt-1">
              {formData.bio?.length || 0}/500 characters
            </p>
          </FormField>

          {/* Physical Stats */}
          <div className="grid grid-cols-2 gap-4">
            {/* Weight */}
            <FormField label="Weight (kg)" error={errors.weight}>
              <div className="relative">
                <Scale className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                    text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Weight in kg"
                />
              </div>
            </FormField>

            {/* Height */}
            <FormField label="Height (cm)" error={errors.height}>
              <div className="relative">
                <Height className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                    text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Height in cm"
                />
              </div>
            </FormField>
          </div>

          {/* Gender */}
          <FormField label="Gender" error={errors.gender}>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Prefer not to say</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </FormField>

          {/* Date of Birth */}
          <FormField label="Date of Birth" error={errors.date_of_birth}>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                  text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </FormField>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {saving ? (
                <>
                  <LoadingSpinner size="sm" />
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