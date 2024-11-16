import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { axiosReq } from '../../services/axiosDefaults';
import { 
  Camera, 
  Save, 
  User, 
  Calendar, 
  Scale, 
  RulerIcon,
  X,
  Loader
} from 'lucide-react';
import Avatar from '../common/Avatar';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const ProfileEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useCurrentUser();
  
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    weight: '',
    height: '',
    gender: '',
    date_of_birth: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await axiosReq.get(`/api/profiles/${id}/`);
        setProfileData({
          name: data.name || '',
          bio: data.bio || '',
          weight: data.weight || '',
          height: data.height || '',
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
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be less than 2MB');
        return;
      }
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData();

    Object.keys(profileData).forEach(key => {
      if (profileData[key]) {
        formData.append(key, profileData[key]);
      }
    });

    if (imageFile) {
      formData.append('profile_image', imageFile);
    }

    try {
      const { data } = await axiosReq.patch(`/api/profiles/${id}/`, formData);
      setCurrentUser(prev => ({
        ...prev,
        profile: data
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

  if (loading) return <LoadingSpinner centered />;

  const FormField = ({ label, icon: Icon, name, type = "text", ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={type}
          name={name}
          value={profileData[name]}
          onChange={handleChange}
          className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 
            rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          {...props}
        />
      </div>
      {errors[name] && <p className="mt-1 text-sm text-red-500">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 rounded-lg shadow-xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 pb-6">
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          <div className="relative">
            <Avatar
              src={imageFile ? URL.createObjectURL(imageFile) : currentUser?.profile?.profile_image}
              text={currentUser?.username}
              size="lg"
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

        <div className="space-y-6">
          {/* Name */}
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
              value={profileData.bio}
              onChange={handleChange}
              rows={4}
              maxLength={500}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 
                rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Tell us about yourself..."
            />
            <p className="mt-1 text-sm text-gray-400">
              {profileData.bio.length}/500 characters
            </p>
            {errors.bio && <p className="mt-1 text-sm text-red-500">{errors.bio}</p>}
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

          {/* Gender Select */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Gender</label>
            <select
              name="gender"
              value={profileData.gender}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 
                rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Prefer not to say</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
            {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
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
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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