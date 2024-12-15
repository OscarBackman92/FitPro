import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useProfileData, useSetProfileData } from '../../contexts/ProfileDataContext';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileWorkouts from './ProfileWorkouts';
import LoadingSpinner from '../common/LoadingSpinner';

const ProfilePage = () => {
  const { id } = useParams(); // ID of the profile to view
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const profileData = useProfileData();
  const { fetchProfileData } = useSetProfileData();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        const profileId = id;
        if (!profileId) {
          throw new Error('No profile ID available.');
        }

        await fetchProfileData(profileId);
      } catch (err) {
        console.error('Error loading profile data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [id, fetchProfileData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner color="green" />
      </div>
    );
  }

  if (error) {
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
  const isOwnProfile = currentUser?.profile?.id === parseInt(id);

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

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />
        <ProfileStats stats={profileData.stats} />
        <ProfileWorkouts
          profileId={profile.id}
          profileUsername={profile.username}
          isOwnProfile={isOwnProfile}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
