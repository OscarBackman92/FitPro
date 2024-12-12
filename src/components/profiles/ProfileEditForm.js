import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, User, Calendar, Scale, RulerIcon, X, Loader, AlertCircle } from 'lucide-react';
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
    is_private: false,
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
          is_private: data.is_private || false,
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
  
    // Allow empty or numeric input for weight/height
    if (name === 'weight' || name === 'height') {
      if (value === '' || /^\d+$/.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
      const dataToSubmit = {
        ...formData,
        weight: formData.weight ? parseInt(formData.weight, 10) : null,
        height: formData.height ? parseInt(formData.height, 10) : null,
      };

      if (imageFile) {
        dataToSubmit.image = imageFile;
      }

      await profileService.updateProfile(id, dataToSubmit);
      toast.success('Profile updated successfully');
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

  const validateForm = () => {
    const errors = {};

    if (formData.weight && (parseInt(formData.weight, 10) < 20 || parseInt(formData.weight, 10) > 500)) {
      errors.weight = 'Weight must be between 20 and 500 kg';
    }

    if (formData.height && (parseInt(formData.height, 10) < 100 || parseInt(formData.height, 10) > 300)) {
      errors.height = 'Height must be between 100 and 300 cm';
    }

    const today = new Date();
    const birthDate = new Date(formData.date_of_birth);
    const age = today.getFullYear() - birthDate.getFullYear();
    if (formData.date_of_birth && (age < 13 || age > 120)) {
      errors.date_of_birth = 'Age must be between 13 and 120 years';
    }

    return errors;
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  const FormField = ({ label, icon: Icon, name, value, onChange, type = 'text', ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
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
          <FormField
            label="Name"
            icon={User}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
          />
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
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Weight (kg)"
              icon={Scale}
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              type="number"
              step="1"
              placeholder="Weight in kg"
            />
            <FormField
              label="Height (cm)"
              icon={RulerIcon}
              name="height"
              value={formData.height}
              onChange={handleChange}
              type="number"
              step="1"
              placeholder="Height in cm"
            />
          </div>
          <FormField
            label="Date of Birth"
            icon={Calendar}
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            type="date"
          />
        </div>
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
      </form>
    </div>
  );
};

export default ProfileEditForm;
