import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useProfileData, useSetProfileData } from '../../contexts/ProfileDataContext';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileWorkouts from './ProfileWorkouts';
import LoadingSpinner from '../common/LoadingSpinner';

const ProfilePage = () => {
  console.log('ProfilePage: Component rendering');
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const profileData = useProfileData();
  const { fetchProfileData } = useSetProfileData();
  
  console.log('ProfilePage: Initial props/context', { 
    id, 
    currentUser, 
    profileData 
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    console.log('ProfilePage: Effect triggered', { id, currentUser });
    
    const loadData = async () => {
      try {
        console.log('ProfilePage: Starting data load');
        setLoading(true);
        setError(null);
        
        const profileId = id || currentUser?.profile?.id;
        console.log('ProfilePage: Loading data for profile:', { profileId, currentUser });
        
        if (!profileId) {
          throw new Error('No profile ID available');
        }

        await fetchProfileData(profileId);
        console.log('ProfilePage: Data load complete');
      } catch (err) {
        console.error('ProfilePage: Error loading profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, currentUser, fetchProfileData]);

  if (loading) {
    console.log('ProfilePage: Rendering loading state');
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner color="green" />
      </div>
    );
  }

  if (error) {
    console.log('ProfilePage: Rendering error state', { error });
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-white mb-4">{error}</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const profile = profileData?.pageProfile?.results?.[0];
  console.log('ProfilePage: Profile data extracted', { profile });

  if (!profile) {
    console.log('ProfilePage: No profile found');
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
          workouts={profileData.workouts?.results || []} 
          isOwnProfile={isOwnProfile}
        />
      </div>
    </div>
  );
};

export default ProfilePage;