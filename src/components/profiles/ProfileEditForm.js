import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader, User, Calendar, Scale, RulerIcon } from 'lucide-react';
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedData = { ...formData };
      if (imageFile) {
        updatedData.image = imageFile;
      }

      await profileService.updateProfile(id, updatedData);
      toast.success('Profile updated successfully');
      navigate(`/profiles/${id}`);
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
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
          className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          {...props}
        />
      </div>
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
          <FormField label="Name" icon={User} name="name" value={formData.name} onChange={handleChange} />
          <FormField label="Weight (kg)" icon={Scale} name="weight" value={formData.weight} onChange={handleChange} />
          <FormField label="Height (cm)" icon={RulerIcon} name="height" value={formData.height} onChange={handleChange} />
          <FormField label="Date of Birth" icon={Calendar} name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} type="date" />
        </div>
        <button type="submit" disabled={saving} className="btn btn-primary">
          {saving ? <Loader className="animate-spin" /> : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default ProfileEditForm;
