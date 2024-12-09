import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useSetProfileData } from '../../contexts/ProfileDataContext';
import { Save, User, Calendar, Scale, 
  RulerIcon, X, Loader, AlertCircle
} from 'lucide-react';
import ProfileImageHandler from '../common/ProfileImageHandler';
import { profileService } from '../../services/profileService';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const ProfileEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const { updateProfileData } = useSetProfileData();
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    weight: '',
    height: '',
    gender: '',
    date_of_birth: '',
    is_private: false
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileService.getProfile(id);
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          weight: data.weight || '',
          height: data.height || '',
          gender: data.gender || '',
          date_of_birth: data.date_of_birth || '',
          is_private: data.is_private || false
        });
      } catch (err) {
        toast.error('Failed to load profile');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    if (id !== currentUser?.profile?.id?.toString()) {
      toast.error('Unauthorized to edit this profile');
      navigate(-1);
      return;
    }

    loadProfile();
  }, [id, navigate, currentUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.weight && (formData.weight < 20 || formData.weight > 500)) {
      newErrors.weight = 'Weight must be between 20 and 500 kg';
    }

    if (formData.height && (formData.height < 100 || formData.height > 300)) {
      newErrors.height = 'Height must be between 100 and 300 cm';
    }

    const today = new Date();
    const birthDate = new Date(formData.date_of_birth);
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (formData.date_of_birth && (age < 13 || age > 120)) {
      newErrors.date_of_birth = 'Age must be between 13 and 120 years';
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
      const dataToSubmit = { ...formData };
      if (imageFile) {
        dataToSubmit.image = imageFile;
      }

      await updateProfileData(id, dataToSubmit);
      navigate(`/profiles/${id}`);
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        toast.error('Failed to update profile');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  const FormField = ({ label, icon: Icon, name, type = "text", ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`block w-full pl-10 pr-3 py-2 bg-gray-700 border 
            ${errors[name] ? 'border-red-500' : 'border-gray-600'} 
            rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent`}
          {...props}
        />
      </div>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
        {/* Header with Profile Image */}
        <div className="flex items-center justify-between border-b border-gray-700 pb-6">
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          <div className="relative">
            <ProfileImageHandler
              src={imageFile ? URL.createObjectURL(imageFile) : currentUser?.profile?.image}
              onChange={setImageFile}
              size={64}
              editable
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <FormField
            label="Name"
            icon={User}
            name="name"
            placeholder="Your full name"
          />

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className={`mt-1 block w-full px-3 py-2 bg-gray-700 border 
                ${errors.bio ? 'border-red-500' : 'border-gray-600'} 
                rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Physical Stats */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Weight (kg)"
              icon={Scale}
              name="weight"
              type="number"
              step="0.1"
              placeholder="Weight in kg"
            />
            <FormField
              label="Height (cm)"
              icon={RulerIcon}
              name="height"
              type="number"
              placeholder="Height in cm"
            />
          </div>

          <FormField
            label="Date of Birth"
            icon={Calendar}
            name="date_of_birth"
            type="date"
          />

          {/* Privacy Settings */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="is_private"
              id="is_private"
              checked={formData.is_private}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-green-500"
            />
            <label htmlFor="is_private" className="text-sm text-gray-300">
              Make profile private
            </label>
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