import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useProfileData, useSetProfileData } from '../../contexts/ProfileDataContext';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileWorkouts from './ProfileWorkouts';
import LoadingSpinner from '../common/LoadingSpinner';
import { AlertCircle, ArrowLeft, DumbbellIcon } from 'lucide-react';

const ProfilePage = () => {
  const { id } = useParams();
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
        await fetchProfileData(id);
      } catch (err) {
        console.error('Error loading profile data:', err);
        setError('Failed to load profile data. Please try again.');
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
  const isOwnProfile = currentUser?.profile?.id === parseInt(id);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <ProfileHeader
          profile={profile}
          isOwnProfile={isOwnProfile}
          onEdit={() => navigate(`/profiles/${id}/edit`)}
        />
        <ProfileStats stats={profileData?.stats || {}} />
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <DumbbellIcon className="h-5 w-5 text-green-500" />
              <h2 className="text-lg font-semibold text-white">Workouts</h2>
            </div>
            <span className="text-sm text-gray-400">
              Total: {profileData?.stats?.total_workouts || 0}
            </span>
          </div>
          <ProfileWorkouts profileId={profile.id} profileUsername={profile.username} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
