import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useProfileData, useSetProfileData } from '../../contexts/ProfileDataContext';
import { 
  DumbbellIcon, 
  Activity,
  Award,
  Clock,
  UserPlus,
  UserMinus,
  Edit2,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { axiosReq } from '../../services/axiosDefaults';
import Avatar from '../common/Avatar';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const { currentProfile, workoutData } = useProfileData();
  const { setProfileData, handleFollow, handleUnfollow, setWorkoutStats, setRecentWorkouts } = useSetProfileData();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!currentUser?.profile) return;

        const profileId = id || currentUser.profile.id;

        // Load profile and workout data
        const [profileResponse, workoutsResponse] = await Promise.all([
          axiosReq.get(`/api/profiles/${profileId}/`),
          axiosReq.get(`/api/workouts/?owner=${profileId}&ordering=-date_logged&limit=5`)
        ]);

        // Update profile data in context
        setProfileData(prev => ({
          ...prev,
          pageProfile: {
            results: [profileResponse.data]
          }
        }));

        // Update workouts in context
        setRecentWorkouts(workoutsResponse.data.results);

        // If viewing own profile, load stats
        if (profileId === currentUser.profile.id) {
          const statsResponse = await axiosReq.get('/api/workouts/statistics/');
          setWorkoutStats({
            totalWorkouts: statsResponse.data.total_workouts || 0,
            weeklyWorkouts: statsResponse.data.workouts_this_week || 0,
            currentStreak: statsResponse.data.current_streak || 0,
            totalMinutes: statsResponse.data.total_duration || 0
          });
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile data');
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [id, currentUser, setProfileData, setWorkoutStats, setRecentWorkouts]);

  const isOwnProfile = currentUser?.profile ? (!id || currentUser.profile.id === parseInt(id)) : false;

  if (!currentUser) {
    navigate('/signin');
    return null;
  }

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !currentProfile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            {error || 'Profile not found'}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg 
              hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      icon: DumbbellIcon,
      label: 'Total Workouts',
      value: workoutData.stats.totalWorkouts,
      color: 'green'
    },
    {
      icon: Activity,
      label: 'This Week',
      value: workoutData.stats.weeklyWorkouts,
      color: 'blue'
    },
    {
      icon: Award,
      label: 'Current Streak',
      value: `${workoutData.stats.currentStreak} days`,
      color: 'yellow'
    },
    {
      icon: Clock,
      label: 'Total Minutes',
      value: workoutData.stats.totalMinutes,
      color: 'purple'
    }
  ];

  const handleFollowClick = async () => {
    if (currentProfile.following_id) {
      await handleUnfollow(currentProfile);
    } else {
      await handleFollow(currentProfile);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar
                src={currentProfile.image}
                text={currentProfile.username}
                size="xl"
              />
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {currentProfile.username}
                  </h1>
                  <p className="text-gray-400">
                    Member since {format(new Date(currentProfile.created_at), 'MMMM yyyy')}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!isOwnProfile && (
                    <button
                      onClick={handleFollowClick}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        currentProfile.following_id
                          ? 'bg-gray-600 hover:bg-gray-700'
                          : 'bg-green-500 hover:bg-green-600'
                      } text-white`}
                    >
                      {currentProfile.following_id ? (
                        <>
                          <UserMinus className="h-5 w-5" />
                          Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-5 w-5" />
                          Follow
                        </>
                      )}
                    </button>
                  )}
                  {isOwnProfile && (
                    <button
                      onClick={() => navigate(`/profiles/${currentUser.profile.id}/edit`)}
                      className="p-2 text-gray-300 hover:text-white bg-gray-700 
                        hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2 text-gray-400">
                {currentProfile.name && (
                  <p><strong className="text-gray-300">Name:</strong> {currentProfile.name}</p>
                )}
                <p>
                  <strong className="text-gray-300">Bio:</strong> {' '}
                  {currentProfile.content || 'No bio provided'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Workout Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {statCards.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <div className="flex items-center justify-between">
                <Icon className={`h-8 w-8 text-${color}-500`} />
                <p className="text-xl font-semibold text-white">{value}</p>
              </div>
              <p className="text-sm text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Recent Workouts */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mt-6">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Workouts</h2>
          {workoutData.recentWorkouts.length > 0 ? (
            <ul className="space-y-4">
              {workoutData.recentWorkouts.map(workout => (
                <li key={workout.id} className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{workout.title}</h3>
                    <p className="text-gray-400">
                      {format(new Date(workout.date_logged), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No recent workouts.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
