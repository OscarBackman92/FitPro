import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { profileService } from '../../services/profileService';
import { 
  Edit2, 
  Settings, 
  Shield, 
  User,
  Lock,
  MapPin,
  Mail,
  Clock,
} from 'lucide-react';
import ProfileImageHandler from '../common/ProfileImageHandler';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

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
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
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
          {/* Profile Image Section */}
          <div className="relative">
            <ProfileImageHandler
              src={profile.profile_image}
              size={128}
              className="ring-4 ring-gray-700"
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
                    <span className="inline-flex items-center justify-center bg-blue-500/10 p-1 rounded-full">
                      <Shield className="h-4 w-4 text-blue-500" />
                    </span>
                  )}
                </h1>
                {profile.bio && (
                  <p className="text-gray-400 mt-1">{profile.bio}</p>
                )}
                <div className="flex flex-wrap gap-4 mt-3">
                  <span className="flex items-center gap-1 text-sm text-gray-400">
                    <Clock className="h-4 w-4" />
                    Joined {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                  {profile.location && (
                    <span className="flex items-center gap-1 text-sm text-gray-400">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </span>
                  )}
                  {profile.email && (
                    <span className="flex items-center gap-1 text-sm text-gray-400">
                      <Mail className="h-4 w-4" />
                      {profile.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
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
            </div>

            {/* Profile Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-3 bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-white">{stats?.workouts_count || 0}</p>
                <p className="text-sm text-gray-400">Workouts</p>
              </div>
              <div className="text-center p-3 bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-white">{stats?.followers_count || 0}</p>
                <p className="text-sm text-gray-400">Followers</p>
              </div>
              <div className="text-center p-3 bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-white">{stats?.following_count || 0}</p>
                <p className="text-sm text-gray-400">Following</p>
              </div>
              <div className="text-center p-3 bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-white">{stats?.streak_count || 0}</p>
                <p className="text-sm text-gray-400">Day Streak</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content Tabs */}
      <div className="mt-8">
        <div className="border-b border-gray-700">
          <nav className="flex gap-4">
            <button
              className={`pb-4 px-2 text-sm font-medium border-b-2 ${
                activeTab === 'overview'
                  ? 'border-green-500 text-green-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`pb-4 px-2 text-sm font-medium border-b-2 ${
                activeTab === 'workouts'
                  ? 'border-green-500 text-green-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('workouts')}
            >
              Workouts
            </button>
            <button
              className={`pb-4 px-2 text-sm font-medium border-b-2 ${
                activeTab === 'goals'
                  ? 'border-green-500 text-green-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('goals')}
            >
              Goals
            </button>
            <button
              className={`pb-4 px-2 text-sm font-medium border-b-2 ${
                activeTab === 'settings'
                  ? 'border-green-500 text-green-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Personal Info</h3>
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-gray-400">Height</dt>
                    <dd className="text-white">{profile.height ? `${profile.height} cm` : 'Not set'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-400">Weight</dt>
                    <dd className="text-white">{profile.weight ? `${profile.weight} kg` : 'Not set'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-400">Gender</dt>
                    <dd className="text-white">{profile.gender || 'Not set'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-400">Birthday</dt>
                    <dd className="text-white">
                      {profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'Not set'}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Activity Overview */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-medium text-white mb-4">Activity Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Today's Activity</span>
                    <span className="text-white font-medium">{stats?.today_workouts || 0} workouts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">This Week</span>
                    <span className="text-white font-medium">{stats?.weekly_workouts || 0} workouts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Current Streak</span>
                    <span className="text-white font-medium">{stats?.current_streak || 0} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Time</span>
                    <span className="text-white font-medium">{stats?.total_duration || 0} minutes</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add other tab contents similarly */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
