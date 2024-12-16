import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Loader } from 'lucide-react';
import { useSetProfileData } from '../../contexts/ProfileDataContext';
import ProfileImageHandler from '../common/ProfileImageHandler';
import LoadingSpinner from '../common/LoadingSpinner';
import { profileService } from '../../services/profileService';
import toast from 'react-hot-toast';

const FormField = ({ name, value, onChange, error, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-300 capitalize">
      {props.label} {props.unit ? `(${props.unit})` : ''}
    </label>
    {props.type === 'textarea' ? (
      <textarea
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        rows={props.rows || 4}
        className="mt-1 block w-full rounded-lg bg-gray-700 border border-gray-600 
          text-white px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    ) : (
      <input
        type={props.type || 'text'}
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        step={props.step}
        className="mt-1 block w-full rounded-lg bg-gray-700 border border-gray-600 
          text-white px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    )}
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

const ProfileEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateProfileData } = useSetProfileData();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    weight: '',
    height: '',
    date_of_birth: '',
    profile_image: '',
    gender: ''
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileService.getProfile(id);
        setFormData({
          ...data,
          weight: data.weight?.toString() || '',
          height: data.height?.toString() || '',
          date_of_birth: data.date_of_birth || ''
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
  };

  const handleImageUpdate = async (file) => {
    if (isSubmitting) return;
  
    const imageData = new FormData();
    imageData.append('profile_image', file);
  
    try {
      console.log('Uploading image...');
      const response = await profileService.updateProfile(id, imageData);
      console.log('Response after upload:', response);
  
      // Re-fetch profile data to ensure updated image is displayed
      const updatedProfile = await profileService.getProfile(id);
      await updateProfileData(updatedProfile);
  
      setFormData(prev => ({
        ...prev,
        profile_image: `${updatedProfile.profile_image}?t=${Date.now()}`
      }));
  
      toast.success('Profile image updated');
    } catch (err) {
      console.error('Error updating profile image:', err);
      toast.error('Failed to update profile image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const formDataToSend = new FormData();
  
    // Append profile image if file input exists
    if (fileInputRef.current?.files[0]) {
      formDataToSend.append('profile_image', fileInputRef.current.files[0]);
    }
  
    // Append only editable fields
    const editableFields = ['name', 'bio', 'weight', 'height', 'date_of_birth', 'gender'];
    editableFields.forEach((field) => {
      if (formData[field] !== undefined && formData[field] !== '') {
        formDataToSend.append(field, formData[field]);
      }
    });
  
    try {
      const response = await profileService.updateProfile(id, formDataToSend);
      await updateProfileData(response);
      toast.success('Profile updated successfully');
      navigate(`/profiles/${id}`);
    } catch (err) {
      console.error('Failed to update profile:', err);
      if (err.response?.data) {
        setErrors(err.response.data);
      }
      toast.error('Failed to update profile');
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
            src={formData.profile_image}
            onChange={handleImageUpdate}
            size="xl"
            editable
            disabled={isSubmitting}
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <FormField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />

          <FormField
            name="bio"
            label="Bio"
            type="textarea"
            value={formData.bio}
            onChange={handleChange}
            error={errors.bio}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="weight"
              label="Weight"
              type="number"
              step="0.1"
              unit="kg"
              value={formData.weight}
              onChange={handleChange}
              error={errors.weight}
            />

            <FormField
              name="height"
              label="Height"
              type="number"
              step="0.1"
              unit="cm"
              value={formData.height}
              onChange={handleChange}
              error={errors.height}
            />
          </div>

          <FormField
            name="date_of_birth"
            label="Date of Birth"
            type="date"
            value={formData.date_of_birth}
            onChange={handleChange}
            error={errors.date_of_birth}
          />

          <div>
            <label className="block text-sm font-medium text-gray-300">Gender</label>
            <select
              name="gender"
              value={formData.gender || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg bg-gray-700 border border-gray-600 
                text-white px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
            {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-400 hover:text-gray-300 flex items-center gap-2"
          >
            <X className="h-5 w-5" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
