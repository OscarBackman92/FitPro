import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Loader } from 'lucide-react';
import ProfileImageHandler from '../common/ProfileImageHandler';
import LoadingSpinner from '../common/LoadingSpinner';
import { profileService } from '../../services/profileService';
import toast from 'react-hot-toast';

const formFields = {
  text: [
    { name: 'name', label: 'Name' },
    { name: 'bio', label: 'Bio', type: 'textarea', rows: 4 }
  ],
  measurements: [
    { name: 'weight', label: 'Weight', unit: 'kg' },
    { name: 'height', label: 'Height', unit: 'cm' }
  ]
};

const FormField = ({ name, value, onChange, error, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-300 capitalize">
      {props.label} {props.unit ? `(${props.unit})` : ''}
    </label>
    {props.type === 'textarea' ? (
      <textarea
        id={name}
        name={name}
        value={value}
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
        value={value}
        onChange={onChange}
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
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '', bio: '', weight: '', height: '', date_of_birth: '', profile_image: ''
  });

  useEffect(() => {
    profileService.getProfile(id)
      .then(data => setFormData({ ...data, weight: data.weight?.toString() || '', height: data.height?.toString() || '' }))
      .catch(() => { toast.error('Failed to load profile'); navigate(-1); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    profileService.updateProfile(id, {
      ...formData,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      height: formData.height ? parseFloat(formData.height) : null
    })
      .then(() => { toast.success('Profile updated successfully'); navigate(`/profiles/${id}`); })
      .catch(err => {
        console.error('Failed to update profile:', err);
        toast.error('Failed to update profile');
        if (err.response?.data) setErrors(err.response.data);
      })
      .finally(() => setIsSubmitting(false));
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between border-b border-gray-700 pb-6">
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          <ProfileImageHandler
            src={formData.profile_image}
            onChange={file => {
              if (!file) return;
              const data = new FormData();
              data.append('profile_image', file);
              profileService.updateProfile(id, data)
                .then(response => {
                  setFormData(prev => ({ ...prev, profile_image: response.profile_image }));
                  toast.success('Profile image updated');
                })
                .catch(() => toast.error('Failed to update profile image'));
            }}
            size={64}
            editable
          />
        </div>

        <div className="space-y-6">
          {formFields.text.map(field => (
            <FormField
              key={field.name}
              {...field}
              value={formData[field.name]}
              onChange={e => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
              error={errors[field.name]}
            />
          ))}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formFields.measurements.map(field => (
              <FormField
                key={field.name}
                {...field}
                value={formData[field.name]}
                onChange={e => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                error={errors[field.name]}
              />
            ))}
          </div>

          <FormField
            name="date_of_birth"
            label="Date of Birth"
            type="date"
            value={formData.date_of_birth}
            onChange={e => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
          />
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
          <button type="button" onClick={() => navigate(-1)} 
            className="px-4 py-2 text-gray-400 hover:text-gray-300 flex items-center gap-2">
            <X className="h-5 w-5" />Cancel
          </button>
          <button type="submit" disabled={isSubmitting}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
            {isSubmitting ? (<><Loader className="h-5 w-5 animate-spin" />Saving...</>) : 
              (<><Save className="h-5 w-5" />Save Changes</>)}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;