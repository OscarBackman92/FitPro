// src/components/profiles/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useProfileData, useSetProfileData } from '../../contexts/ProfileDataContext';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileWorkouts from './ProfileWorkouts';
import LoadingSpinner from '../common/LoadingSpinner';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const { profileData } = useProfileData();
  const { fetchProfileData } = useSetProfileData();
  
  const [loading, setLoading] = useState(true);
  const [setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const profileId = id || currentUser?.profile?.id;
        console.log('ProfilePage: Loading data for profile:', { profileId, currentUser });
        
        if (!profileId) {
          throw new Error('No profile ID available');
        }

        await fetchProfileData(profileId);
        setLoading(false);
      } catch (err) {
        console.error('ProfilePage: Error loading profile:', err);
        setError('Failed to load profile data');
        setLoading(false);
      }
    };

    loadData();
  }, [id, currentUser, fetchProfileData, setError]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner color="green" />
      </div>
    );
  }

  // Get the profile data
  const profile = profileData?.pageProfile?.results?.[0];
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-white mb-4">Profile not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg 
            hover:bg-gray-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isOwnProfile = currentUser?.profile?.id === parseInt(id || currentUser?.profile?.id);

  // Prepare the stats data
  const stats = {
    total_workouts: profileData.stats?.total_workouts || 0,
    workouts_this_week: profileData.stats?.workouts_this_week || 0,
    total_duration: profileData.stats?.total_workout_time || 0,
    current_streak: profileData.stats?.current_streak || 0
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <ProfileHeader 
          profile={profile} 
          isOwnProfile={isOwnProfile} 
        />
        <ProfileStats 
          stats={stats} 
        />
        <ProfileWorkouts 
          workouts={profileData.workouts?.results || []} 
          isOwnProfile={isOwnProfile}
        />
      </div>
    </div>
  );
};

export default ProfilePage;