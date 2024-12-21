import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useProfileData, useSetProfileData } from '../../contexts/ProfileDataContext';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import LoadingSpinner from '../common/LoadingSpinner';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const ProfilePage = () => {
  const { id } = useParams(); // Get the profile ID from the URL parameters
  const navigate = useNavigate(); // Hook to navigate programmatically
  const { currentUser } = useCurrentUser(); // Get the current user context
  const profileData = useProfileData(); // Get the profile data context
  const { fetchProfileData } = useSetProfileData(); // Function to fetch profile data
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage error messages

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchProfileData(id); // Fetch profile data based on the profile ID
      } catch (err) {
        console.error('Error loading profile data:', err);
        setError('Failed to load profile data. Please try again.'); // Set error message if fetching fails
      } finally {
        setLoading(false); // Set loading to false after fetching is done
      }
    };

    if (id) loadProfileData(); // Load profile data if ID is available
  }, [id, fetchProfileData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner color="green" size="lg" /> {/* Show loading spinner while data is being fetched */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="flex items-center gap-3 text-red-500 mb-4">
          <AlertCircle className="h-6 w-6" />
          <h2 className="text-2xl font-bold text-white">{error}</h2> {/* Display error message */}
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Try Again {/* Button to reload the page */}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back {/* Button to navigate back to the previous page */}
          </button>
        </div>
      </div>
    );
  }

  const profile = profileData?.pageProfile?.results?.[0]; // Get the profile data from the fetched results
  const isOwnProfile = currentUser?.profile?.id === parseInt(id); // Check if the profile belongs to the current user

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <ProfileHeader
          profile={profile}
          isOwnProfile={isOwnProfile}
          onEdit={() => navigate(`/profiles/${id}/edit`)} // Navigate to the edit profile page
        />
        <ProfileStats stats={profileData?.stats || {}} /> {/* Display profile statistics */}
      </div>
    </div>
  );
};

export default ProfilePage;
