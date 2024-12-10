import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useProfileData, useSetProfileData } from '../../contexts/ProfileDataContext';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileWorkouts from './ProfileWorkouts';
import LoadingSpinner from '../common/LoadingSpinner';
import { logger } from '../../services/loggerService';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const { profileData } = useProfileData();
  const { fetchProfileData } = useSetProfileData();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        console.error('ProfilePage: Error loading profile:', err);
        logger.error('Profile loading error:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      loadData();
    }
  }, [id, currentUser, fetchProfileData]);

  if (loading) {
    return <LoadingSpinner centered fullScreen />;
  }

  if (error || !profileData?.pageProfile?.results?.[0]) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            {error || 'Profile not found'}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const profile = profileData.pageProfile.results[0];
  const isOwnProfile = currentUser?.profile?.id === parseInt(id || currentUser?.profile?.id);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <ProfileHeader 
          profile={profile} 
          isOwnProfile={isOwnProfile} 
        />
        <ProfileStats 
          stats={profileData.stats} 
        />
        <ProfileWorkouts 
          workouts={profileData.workouts.results} 
          isOwnProfile={isOwnProfile}
        />
      </div>
    </div>
  );
};

export default ProfilePage;