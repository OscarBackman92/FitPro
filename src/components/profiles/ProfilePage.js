import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useProfileData, useSetProfileData } from '../../contexts/ProfileDataContext';
import { 
  AlertCircle, ArrowLeft, Edit2, Scale, RulerIcon, 
  Calendar, User, DumbbellIcon 
} from 'lucide-react';
import ProfileStats from './ProfileStats';
import ProfileWorkouts from './ProfileWorkouts';
import LoadingSpinner from '../common/LoadingSpinner';
import Avatar from '../common/Avatar';
import { format, isValid, parseISO } from 'date-fns';

const InfoBadge = ({ icon: Icon, label, value }) => {
  if (!value) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-700/30 rounded-lg">
      <Icon className="h-4 w-4 text-green-400" />
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const profileData = useProfileData();
  const { fetchProfileData } = useSetProfileData();
  const [imageKey, setImageKey] = useState(Date.now());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchProfileData(id);
        setImageKey(Date.now()); // Reset image key to force refresh
      } catch (err) {
        console.error('Error loading profile data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProfileData();
  }, [id, fetchProfileData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner color="green" size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="flex items-center gap-3 text-red-500 mb-4">
          <AlertCircle className="h-6 w-6" />
          <h2 className="text-2xl font-bold text-white">{error}</h2>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const profile = profileData?.pageProfile?.results?.[0];
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-white mb-4">Profile not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isOwnProfile = currentUser?.profile?.id === parseInt(id);
  const stats = profileData?.stats || {
    total_workouts: 0,
    workouts_this_week: 0,
    current_streak: 0,
    total_workout_time: 0
  };

  const formatDate = (dateString, formatString) => {
    if (!dateString) return null;
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, formatString) : null;
    } catch {
      return null;
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    try {
      const date = parseISO(birthDate);
      if (!isValid(date)) return null;
      
      const today = new Date();
      let age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
        age--;
      }
      
      return age;
    } catch {
      return null;
    }
  };

  const getProfileImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    return `${imageUrl}?t=${imageKey}`;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Profile Header Card */}
        <div className="relative bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-green-500/10 to-blue-500/10" />
          
          {/* Edit Button */}
          {isOwnProfile && (
            <button
              onClick={() => navigate(`/profiles/${id}/edit`)}
              className="absolute top-4 right-4 px-4 py-2 bg-gray-800/90 hover:bg-gray-700 
                text-gray-300 hover:text-white rounded-lg transition-all duration-200 
                hover:scale-105 backdrop-blur-sm flex items-center gap-2 
                border border-gray-700"
            >
              <Edit2 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          )}

          {/* Profile Content */}
          <div className="p-6 -mt-16">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center lg:items-start">
                <Avatar
                  src={profile.profile_image ? getProfileImageUrl(profile.profile_image) : null}
                  text={profile.name || profile.username}
                  height={128}
                  className="ring-4 ring-gray-800 bg-gray-700 rounded-full"
                />
                <div className="mt-4 text-center lg:text-left">
                  <h1 className="text-2xl font-bold text-white">
                    {profile.name || profile.username}
                  </h1>
                  <div className="mt-1 flex flex-wrap gap-2 justify-center lg:justify-start">
                    <span className="text-gray-400 text-sm">
                      Member since {formatDate(profile.created_at, 'MMMM yyyy')}
                    </span>
                    {calculateAge(profile.date_of_birth) && (
                      <span className="text-sm bg-gray-700/30 px-2 py-0.5 rounded text-gray-300">
                        {calculateAge(profile.date_of_birth)} years old
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex-1 space-y-6">
                {/* Bio */}
                {profile.bio && (
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {profile.weight && (
                    <InfoBadge 
                      icon={Scale} 
                      label="Weight"
                      value={`${profile.weight} kg`}
                    />
                  )}
                  {profile.height && (
                    <InfoBadge 
                      icon={RulerIcon}
                      label="Height"
                      value={`${profile.height} cm`}
                    />
                  )}
                  {profile.date_of_birth && (
                    <InfoBadge 
                      icon={Calendar}
                      label="Birth Date"
                      value={formatDate(profile.date_of_birth, 'PP')}
                    />
                  )}
                  {profile.gender && (
                    <InfoBadge 
                      icon={User}
                      label="Gender"
                      value={profile.gender === 'M' ? 'Male' : profile.gender === 'F' ? 'Female' : 'Other'}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <ProfileStats stats={stats} />

        {/* Workouts Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <DumbbellIcon className="h-5 w-5 text-green-500" />
              <h2 className="text-lg font-semibold text-white">Workouts</h2>
            </div>
            <span className="text-sm text-gray-400">
              Total: {stats.total_workouts}
            </span>
          </div>
          <ProfileWorkouts
            profileId={profile.id}
            profileUsername={profile.username}
            isOwnProfile={isOwnProfile}
            stats={stats}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;