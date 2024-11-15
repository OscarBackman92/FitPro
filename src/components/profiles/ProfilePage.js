import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { 
  Edit2, Shield, User, Lock, MapPin, 
  Mail, Clock, Activity, Award, DumbbellIcon 
} from 'lucide-react';
import Avatar from '../common/Avatar';
import LoadingSpinner from '../common/LoadingSpinner';
import { axiosReq } from '../../services/axiosDefaults';
import toast from 'react-hot-toast';

const Card = ({ children, className = '' }) => (
  <div className={`bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
    {children}
  </div>
);

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="text-center p-4 bg-gray-700 rounded-lg">
    <div className="flex justify-center mb-2">
      <Icon className="h-6 w-6 text-green-500" />
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-sm text-gray-400">{label}</p>
  </div>
);

const MetaInfo = ({ icon: Icon, text }) => (
  <span className="flex items-center gap-1 text-sm text-gray-400">
    <Icon className="h-4 w-4" />
    {text}
  </span>
);

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useCurrentUser();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const isOwnProfile = currentUser?.profile?.id === parseInt(id);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const [profileData, statsData] = await Promise.all([
          axiosReq.get(`/api/profiles/${id}/`),
          // Use the same stats endpoint as Dashboard
          axiosReq.get('/api/workouts/statistics/') 
        ]);

        setProfile(profileData.data);
        setStats(statsData.data);
      } catch (err) {
        console.error('Profile load error:', err);
        toast.error('Failed to load profile');
        if (err.response?.status === 404) {
          navigate('/404');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
}, [id, navigate]);

  const handleImageUpdate = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await axiosReq.post(`/api/profiles/${id}/image/`, formData);
      
      setProfile(prev => ({
        ...prev,
        profile_image: data.image
      }));

      if (isOwnProfile && setCurrentUser) {
        setCurrentUser(prev => ({
          ...prev,
          profile_image: data.image
        }));
      }

      toast.success('Profile image updated successfully');
    } catch (err) {
      console.error('Image upload error:', err);
      toast.error('Failed to update profile image');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <LoadingSpinner centered />;

  if (!profile) {
    return (
      <div className="text-center py-12">
        <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-200">Profile Not Found</h2>
        <p className="text-gray-400 mt-2">
          This profile doesn't exist or you don't have permission to view it.
        </p>
      </div>
    );
  }

  const statsData = [
    { 
      icon: DumbbellIcon, 
      label: 'Total Workouts',
      // Use the same field name as Dashboard
      value: stats?.workouts_count || 0
    },
    { 
      icon: Award, 
      label: 'Current Streak', 
      // Use the same field name as Dashboard
      value: `${stats?.current_streak || 0} days`
    },
    { 
      icon: Activity, 
      label: 'This Week', 
      // Use the same field name as Dashboard
      value: stats?.workouts_this_week || 0
    },
    { 
      icon: Clock, 
      label: 'Total Time', 
      value: `${stats?.total_duration || 0} mins`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar
                src={profile.profile_image}
                text={profile.username}
                size="xl"
                className="w-32 h-32 ring-4 ring-gray-700"
              />
              {isOwnProfile && !uploading && (
                <label className="absolute bottom-0 right-0 p-2 bg-green-500 rounded-full 
                  cursor-pointer hover:bg-green-600 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpdate}
                  />
                  <Edit2 className="h-4 w-4 text-white" />
                </label>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full 
                  flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-white"></div>
                </div>
              )}
            </div>
            {isOwnProfile && (
              <button
                onClick={() => navigate(`/profiles/${id}/edit`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 
                  bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Info Section */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  {profile.name || profile.username}
                  {profile.is_verified && <Shield className="h-4 w-4 text-blue-500" />}
                </h1>
                <p className="text-gray-400">@{profile.username}</p>
                {profile?.bio && (
                  <p className="text-gray-300 mt-3 whitespace-pre-wrap break-words max-w-2xl">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <MetaInfo 
                icon={Clock} 
                text={`Joined ${new Date(profile.created_at).toLocaleDateString()}`} 
              />
              {profile.location && <MetaInfo icon={MapPin} text={profile.location} />}
              {profile.email && <MetaInfo icon={Mail} text={profile.email} />}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700">
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </Card>

      {/* Personal Info Section */}
      <div className="mt-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Personal Info</h2>
            <Lock className="h-4 w-4 text-gray-400" />
          </div>
          
          <dl className="space-y-4">
            {[
              { label: 'Height', value: profile.height ? `${profile.height} cm` : 'Not set' },
              { label: 'Weight', value: profile.weight ? `${profile.weight} kg` : 'Not set' },
              { label: 'Gender', value: profile.gender || 'Not set' },
              { label: 'Birthday', value: profile.date_of_birth ? 
                new Date(profile.date_of_birth).toLocaleDateString() : 'Not set' }
            ].map(item => (
              <div key={item.label} className="flex justify-between">
                <dt className="text-gray-400">{item.label}</dt>
                <dd className="text-white font-medium">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;