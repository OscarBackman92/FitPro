import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useProfileData, useSetProfileData } from '../../contexts/ProfileDataContext';
import { 
  AlertCircle, ArrowLeft, Edit2, Scale, RulerIcon, 
  Calendar, Mail, MapPin, User, Cake 
} from 'lucide-react';
import ProfileStats from './ProfileStats';
import ProfileWorkouts from './ProfileWorkouts';
import LoadingSpinner from '../common/LoadingSpinner';
import Avatar from '../common/Avatar';
import { format, isValid, parseISO } from 'date-fns';

const ErrorState = ({ message, onRetry }) => (
  <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
    <div className="flex items-center gap-3 text-red-500 mb-4">
      <AlertCircle className="h-6 w-6" />
      <h2 className="text-2xl font-bold text-white">{message}</h2>
    </div>
    <div className="flex gap-4">
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        Try Again
      </button>
      <button
        onClick={() => onRetry()}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Go Back
      </button>
    </div>
  </div>
);

const LoadingState = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <LoadingSpinner color="green" size="lg" />
  </div>
);

const StatBadge = ({ icon: Icon, label, value }) => {
  if (!value) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
      <div className="p-2 bg-gray-700 rounded-lg">
        <Icon className="h-4 w-4 text-green-500" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-white font-medium">{value}</span>
      </div>
    </div>
  );
};

const InfoBadge = ({ icon: Icon, text }) => {
  if (!text) return null;

  return (
    <div className="flex items-center gap-2 text-gray-400 bg-gray-700/20 px-3 py-1.5 rounded-lg">
      <Icon className="h-4 w-4" />
      <span className="text-sm">{text}</span>
    </div>
  );
};

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const profileData = useProfileData();
  const { fetchProfileData } = useSetProfileData();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [setRetryCount] = useState(0);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchProfileData(id);
      } catch (err) {
        console.error('Error loading profile data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProfileData();
  }, [id, fetchProfileData]);

  // Handle loading state
  if (loading) {
    return <LoadingState />;
  }

  // Handle error states
  if (error) {
    return (
      <ErrorState 
        message={error} 
        onRetry={() => {
          if (error === 'Profile not found') {
            navigate(-1);
          } else {
            setRetryCount(count => count + 1);
          }
        }} 
      />
    );
  }

  const profile = profileData?.pageProfile?.results?.[0];
  
  // Handle missing profile data
  if (!profile) {
    return (
      <ErrorState 
        message="Profile not found" 
        onRetry={() => navigate(-1)} 
      />
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

  const age = calculateAge(profile.date_of_birth);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Profile Header Card */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Header Banner */}
          <div className="relative h-32 bg-gradient-to-r from-green-500/10 to-blue-500/10">
            {isOwnProfile && (
              <button
                onClick={() => navigate(`/profiles/${id}/edit`)}
                className="absolute top-4 right-4 p-2.5 bg-gray-800/90 hover:bg-gray-700 
                  text-gray-300 hover:text-white rounded-lg transition-all duration-200 
                  hover:scale-105 backdrop-blur-sm flex items-center gap-2 
                  border border-gray-700 group"
              >
                <Edit2 className="h-4 w-4 group-hover:text-green-500 transition-colors" />
                <span className="text-sm font-medium">Edit Profile</span>
              </button>
            )}
          </div>

          {/* Profile Content */}
          <div className="p-6 -mt-16">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center md:items-start">
                <Avatar
                  src={profile.profile_image}
                  text={profile.name || profile.username}
                  height={128}
                  className="ring-4 ring-gray-800 bg-gray-700"
                />
                <div className="mt-4 text-center md:text-left">
                  <h1 className="text-2xl font-bold text-white">
                    {profile.name || profile.username}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <p className="text-gray-400 text-sm">
                      Member since {formatDate(profile.created_at, 'MMMM yyyy')}
                    </p>
                    {age && (
                      <span className="text-sm bg-gray-700/30 px-2 py-0.5 rounded text-gray-300">
                        {age} years old
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex-1 space-y-6">
                {/* Bio */}
                {profile.bio && (
                  <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-700/50">
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatBadge 
                    icon={Scale} 
                    label="Weight" 
                    value={profile.weight && `${profile.weight} kg`} 
                  />
                  <StatBadge 
                    icon={RulerIcon} 
                    label="Height" 
                    value={profile.height && `${profile.height} cm`} 
                  />
                  <StatBadge 
                    icon={Calendar} 
                    label="Birth Date" 
                    value={profile.date_of_birth && formatDate(profile.date_of_birth, 'PP')} 
                  />
                </div>

                {/* Additional Info */}
                <div className="flex flex-wrap gap-3">
                  <InfoBadge icon={Mail} text={profile.email} />
                  <InfoBadge icon={MapPin} text={profile.location} />
                  {profile.gender && (
                    <InfoBadge 
                      icon={User} 
                      text={profile.gender === 'M' ? 'Male' : profile.gender === 'F' ? 'Female' : 'Other'} 
                    />
                  )}
                  {age && <InfoBadge icon={Cake} text={`${age} years old`} />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <ProfileStats 
          stats={stats}
          isLoading={!profileData?.stats}
        />

        {/* Workouts Section */}
        <ProfileWorkouts
          profileId={profile.id}
          profileUsername={profile.username}
          isOwnProfile={isOwnProfile}
          stats={stats}
        />
      </div>
    </div>
  );
};

export default ProfilePage;