import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useProfileData, useSetProfileData } from '../../contexts/ProfileDataContext';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileWorkouts from './ProfileWorkouts';
import LoadingSpinner from '../common/LoadingSpinner';

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

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Profile Header Section */}
        <ProfileHeader 
          profile={profile} 
          isOwnProfile={isOwnProfile} 
        />

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