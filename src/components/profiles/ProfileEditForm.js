import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSetCurrentUser } from '../../contexts/CurrentUserContext';
import { Save, X, Loader, Upload } from 'lucide-react';
import { axiosReq } from '../../services/axiosDefaults';
import toast from 'react-hot-toast';

const ProfileEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const setCurrentUser = useSetCurrentUser();
  const imageInputRef = useRef();

  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    date_of_birth: '',
    gender: '',
    weight: '',
    height: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [profileImage, setProfileImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/api/profiles/${id}/`);
        console.log('Loading profile data:', data);

        const { 
          name, bio, profile_image, date_of_birth, 
          gender, weight, height 
        } = data;
        
        const formattedData = {
          name: name || '',
          bio: bio || '',
          date_of_birth: date_of_birth || '',
          gender: gender || '',
          weight: weight || '',
          height: height || '',
        };

        console.log('Formatted profile data:', formattedData);
        setProfileData(formattedData);
        setProfileImage(profile_image);
      } catch (err) {
        console.error('Error loading profile:', err);
        toast.error('Failed to load profile');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    handleMount();
  }, [id, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(`Field "${name}" changed to:`, value);
    setProfileData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      console.log('Selected profile_image:', {
        name: file.name,
        type: file.type,
        size: file.size
      });
      setImageFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const formData = new FormData();
      console.log('Current profile data before submission:', profileData);

      // Append regular form fields
      Object.keys(profileData).forEach((key) => {
        if (profileData[key] !== null && profileData[key] !== undefined && profileData[key] !== '') {
          formData.append(key, profileData[key]);
          console.log(`Appending ${key}:`, profileData[key]);
        }
      });

      // Append image if selected
      if (imageFile) {
        formData.append('profile_image', imageFile);
        console.log('Appending profile_image:', {
          name: imageFile.name,
          type: imageFile.type,
          size: imageFile.size
        });
      }

      console.log('Final FormData entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0], ':', pair[1]);
      }

      const { data } = await axiosReq.put(`/api/profiles/${id}/`, formData);
      console.log('Server response:', data);

      // Update current user context with new image
      setCurrentUser(prevUser => ({
        ...prevUser,
        profile_image: data.profile_image
      }));

      // Force reload the profile image by appending timestamp
      setProfileImage(`${data.profile_image}?t=${Date.now()}`);

      toast.success('Profile updated successfully');
      navigate(`/profiles/${id}`);
    } catch (err) {
      console.error('Profile update error:', err.response?.data || err);
      setErrors(err.response?.data || {});
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <form 
        onSubmit={handleSubmit} 
        className="max-w-2xl mx-auto space-y-6 bg-gray-800 rounded-lg p-6 shadow-xl"
      >
        {/* Image Upload */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700">
              {profileImage && (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <label
              className="absolute bottom-0 right-0 p-2 bg-green-500 rounded-full cursor-pointer 
                hover:bg-green-600 transition-colors"
              htmlFor="image-upload"
            >
              <Upload className="h-5 w-5 text-white" />
            </label>
            <input
              id="image-upload"
              ref={imageInputRef}
              className="hidden"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          {errors?.profile_image?.map((message, idx) => (
            <p key={idx} className="text-red-500 text-sm">{message}</p>
          ))}
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg bg-gray-700 border border-gray-600 
                text-white px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {errors?.name?.map((message, idx) => (
              <p key={idx} className="text-red-500 text-sm mt-1">{message}</p>
            ))}
          </div>

          {/* Bio Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Bio</label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-lg bg-gray-700 border border-gray-600 
                text-white px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {errors?.bio?.map((message, idx) => (
              <p key={idx} className="text-red-500 text-sm mt-1">{message}</p>
            ))}
          </div>

          {/* Height and Weight Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={profileData.height}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg bg-gray-700 border border-gray-600 
                  text-white px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {errors?.height?.map((message, idx) => (
                <p key={idx} className="text-red-500 text-sm mt-1">{message}</p>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={profileData.weight}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg bg-gray-700 border border-gray-600 
                  text-white px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {errors?.weight?.map((message, idx) => (
                <p key={idx} className="text-red-500 text-sm mt-1">{message}</p>
              ))}
            </div>
          </div>

          {/* Date of Birth Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={profileData.date_of_birth}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg bg-gray-700 border border-gray-600 
                text-white px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {errors?.date_of_birth?.map((message, idx) => (
              <p key={idx} className="text-red-500 text-sm mt-1">{message}</p>
            ))}
          </div>

          {/* Gender Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Gender</label>
            <select
              name="gender"
              value={profileData.gender}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg bg-gray-700 border border-gray-600 
                text-white px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
            {errors?.gender?.map((message, idx) => (
              <p key={idx} className="text-red-500 text-sm mt-1">{message}</p>
            ))}
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
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;