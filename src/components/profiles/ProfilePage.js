import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { profileService } from '../../services/profileService';
import { 
  Edit2, Settings, Shield, User, Lock,
  MapPin, Mail, Clock, Activity,
  Award, DumbbellIcon,
} from 'lucide-react';
import ProfileImageHandler from '../common/ProfileImageHandler';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

// Tab content components
const OverviewTab = ({ profile, stats }) => (
  <div className="grid md:grid-cols-2 gap-6">
    {/* Personal Info Card */}
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">Personal Info</h3>
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
          <div key={item.label}>
            <dt className="text-sm text-gray-400">{item.label}</dt>
            <dd className="text-white">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>

    {/* Activity Overview Card */}
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-medium text-white mb-4">Activity Overview</h3>
      <div className="space-y-4">
        {[
          { label: "Today's Activity", value: `${stats?.today_workouts || 0} workouts` },
          { label: 'This Week', value: `${stats?.weekly_workouts || 0} workouts` },
          { label: 'Current Streak', value: `${stats?.current_streak || 0} days` },
          { label: 'Total Time', value: `${stats?.total_duration || 0} minutes` }
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-gray-400">{item.label}</span>
            <span className="text-white font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Stats card component
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="text-center p-3 bg-gray-700 rounded-lg">
    <div className="flex items-center justify-center mb-2">
      <Icon className="h-5 w-5 text-green-500" />
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-sm text-gray-400">{label}</p>
  </div>
);

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const isOwnProfile = currentUser?.profile?.id === parseInt(id);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'workouts', label: 'Workouts' },
    { id: 'goals', label: 'Goals' },
    ...(isOwnProfile ? [{ id: 'settings', label: 'Settings' }] : [])
  ];

  const statsCards = [
    { icon: DumbbellIcon, label: 'Workouts', value: stats?.workouts_count || 0 },
    { icon: User, label: 'Followers', value: stats?.followers_count || 0 },
    { icon: Activity, label: 'Following', value: stats?.following_count || 0 },
    { icon: Award, label: 'Day Streak', value: stats?.streak_count || 0 }
  ];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const [profileData, statsData] = await Promise.all([
          profileService.getProfile(id),
          profileService.getProfileStats(id)
        ]);
        setProfile(profileData);
        setStats(statsData);
      } catch (err) {
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

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-200">Profile Not Found</h2>
        <p className="text-gray-400 mt-2">This profile doesn't exist or you don't have permission to view it.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Profile Image */}
          <div className="relative">
            <ProfileImageHandler
              src={profile.profile_image}
              size={128}
              className="ring-4 ring-gray-700"
              editable={isOwnProfile}
            />
            {profile.visibility === 'private' && (
              <div className="absolute -top-2 -right-2 bg-gray-700 p-1 rounded-full">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  {profile.name || profile.username}
                  {profile.is_verified && (
                    <Shield className="h-4 w-4 text-blue-500" />
                  )}
                </h1>
                {profile.bio && <p className="text-gray-400 mt-1">{profile.bio}</p>}
                <div className="flex flex-wrap gap-4 mt-3">
                  {[
                    { icon: Clock, text: `Joined ${new Date(profile.created_at).toLocaleDateString()}` },
                    profile.location && { icon: MapPin, text: profile.location },
                    profile.email && { icon: Mail, text: profile.email }
                  ].filter(Boolean).map((item, index) => (
                    <span key={index} className="flex items-center gap-1 text-sm text-gray-400">
                      <item.icon className="h-4 w-4" />
                      {item.text}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {isOwnProfile && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate(`/profiles/${id}/edit`)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white 
                      rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => navigate(`/profiles/${id}/settings`)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white 
                      rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {statsCards.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mt-8">
        <div className="border-b border-gray-700">
          <nav className="flex gap-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <OverviewTab profile={profile} stats={stats} />
          )}
          {/* Add other tab contents as needed */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;