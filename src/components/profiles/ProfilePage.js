import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useProfileData, useSetProfileData } from '../../contexts/ProfileDataContext';
import { DumbbellIcon, Activity, Award, Clock, Edit2, UserPlus, UserMinus } from 'lucide-react';
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
  const { setProfileData, handleFollow: followUser, handleUnfollow: unfollowUser } = useSetProfileData();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUser) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Determine which profile to load
        const targetId = id || currentUser.profile?.id;

        if (!targetId) {
          throw new Error('No profile ID available');
        }

        // Load profile and workouts using the correct URL
        const [profileResponse, workoutsResponse] = await Promise.all([
          axiosReq.get(`/api/profiles/profiles/${targetId}/`),
          axiosReq.get('/api/workouts/', {
            params: { owner: targetId, ordering: '-date_logged', limit: 5 }
          })
        ]);

        setProfileData(prev => ({
          ...prev,
          pageProfile: { results: [profileResponse.data] },
          workoutData: {
            ...prev.workoutData,
            recentWorkouts: workoutsResponse.data.results || []
          }
        }));

        // Load stats if viewing own profile
        if (targetId === currentUser.profile?.id) {
          try {
            const statsResponse = await axiosReq.get('/api/workouts/statistics/');
            setProfileData(prev => ({
              ...prev,
              workoutData: {
                ...prev.workoutData,
                stats: {
                  totalWorkouts: statsResponse.data.total_workouts || 0,
                  weeklyWorkouts: statsResponse.data.workouts_this_week || 0,
                  currentStreak: statsResponse.data.current_streak || 0,
                  totalMinutes: statsResponse.data.total_duration || 0
                }
              }
            }));
          } catch (statsErr) {
            console.error('Failed to load stats:', statsErr);
            toast.error('Failed to load workout statistics');
          }
        }

      } catch (err) {
        console.error('Error loading profile:', err);
        if (err.response?.status === 404) {
          setError('Profile not found');
          toast.error('Profile not found');
        } else if (err.response?.status === 401) {
          navigate('/signin');
        } else {
          setError('Failed to load profile data');
          toast.error('Failed to load profile data');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id, currentUser, navigate, setProfileData]);

  const handleFollowClick = async () => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }

    try {
      if (currentProfile.following_id) {
        await unfollowUser(currentProfile);
      } else {
        await followUser(currentProfile);
      }
    } catch (err) {
      toast.error('Failed to update follow status');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (error || !currentProfile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">{error || 'Profile not found'}</h2>
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

  const isOwnProfile = !id || (currentUser?.profile?.id === parseInt(id));

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-6">
            <Avatar
              src={currentProfile.image}
              text={currentProfile.username}
              size="xl"
            />
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-white">{currentProfile.username}</h1>
                  <p className="text-gray-400">
                    Member since {format(new Date(currentProfile.created_at), 'MMMM yyyy')}
                  </p>
                </div>
                
                {!isOwnProfile ? (
                  <button
                    onClick={handleFollowClick}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      currentProfile.following_id ? 'bg-gray-600' : 'bg-green-500'
                    } text-white`}
                  >
                    {currentProfile.following_id ? (
                      <UserMinus className="h-5 w-5" />
                    ) : (
                      <UserPlus className="h-5 w-5" />
                    )}
                    {currentProfile.following_id ? 'Unfollow' : 'Follow'}
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/profiles/${currentUser.profile.id}/edit`)}
                    className="p-2 text-gray-300 hover:text-white bg-gray-700 rounded-lg"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                )}
              </div>

              {currentProfile.name && (
                <p className="mt-4 text-gray-400">
                  <strong className="text-gray-300">Name:</strong> {currentProfile.name}
                </p>
              )}
              
              <p className="text-gray-400">
                <strong className="text-gray-300">Bio:</strong> {currentProfile.content || 'No bio provided'}
              </p>

              <div className="mt-4 flex gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">
                    {currentProfile.followers_count || 0}
                  </div>
                  <div className="text-sm text-gray-400">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">
                    {currentProfile.following_count || 0}
                  </div>
                  <div className="text-sm text-gray-400">Following</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        {isOwnProfile && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <DumbbellIcon className="h-6 w-6 text-green-500 mb-2" />
              <p className="text-xl font-bold text-white">{workoutData.stats.totalWorkouts}</p>
              <p className="text-sm text-gray-400">Total Workouts</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <Activity className="h-6 w-6 text-green-500 mb-2" />
              <p className="text-xl font-bold text-white">{workoutData.stats.weeklyWorkouts}</p>
              <p className="text-sm text-gray-400">This Week</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <Award className="h-6 w-6 text-green-500 mb-2" />
              <p className="text-xl font-bold text-white">{workoutData.stats.currentStreak} days</p>
              <p className="text-sm text-gray-400">Current Streak</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <Clock className="h-6 w-6 text-green-500 mb-2" />
              <p className="text-xl font-bold text-white">{workoutData.stats.totalMinutes}</p>
              <p className="text-sm text-gray-400">Total Minutes</p>
            </div>
          </div>
        )}

        {/* Recent Workouts */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Recent Workouts</h2>
            {workoutData.recentWorkouts?.length > 0 && (
              <button onClick={() => navigate('/workouts')} className="text-sm text-gray-400">
                View All
              </button>
            )}
          </div>

          {workoutData.recentWorkouts?.length > 0 ? (
            <div className="space-y-4">
              {workoutData.recentWorkouts.map(workout => (
                <div key={workout.id} className="flex justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-white">{workout.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                        {workout.workout_type}
                      </span>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                        {workout.intensity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-300">{workout.duration} mins</p>
                    <p className="text-sm text-gray-400">
                      {format(new Date(workout.date_logged), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <DumbbellIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No workouts logged yet</p>
              {isOwnProfile && (
                <button
                  onClick={() => navigate('/workouts/create')}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                  Log Your First Workout
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;