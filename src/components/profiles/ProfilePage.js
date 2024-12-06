import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { 
  DumbbellIcon, 
  Activity,
  Award,
  Clock,
  PlusCircle,
  Edit2,
  Loader
} from 'lucide-react';
import { profileService } from '../../services/profileService';
import Avatar from '../../components/common/Avatar'; 
import { workoutService } from '../../services/workoutService';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const [workouts, setWorkouts] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    weeklyWorkouts: 0,
    currentStreak: 0,
    totalMinutes: 0,
    workoutTypes: [],
    monthlyStats: []
  });

  const isOwnProfile = currentUser?.id === parseInt(id);

  const fetchData = useCallback(async () => {
    const profileId = id || currentUser?.profile?.id || null;
  
    if (!profileId) {
      setError('Profile not found');
      setLoading(false);
      return;
    }
  
    try {
      setLoading(true);
  
      const [profileResponse, workoutsResponse, statsResponse] = await Promise.all([
        profileService.getProfile(profileId),
        workoutService.getWorkouts({ limit: 5, user: profileId }),
        workoutService.getWorkoutStatistics(),
      ]);
  
      setProfileData(profileResponse);
      setWorkouts(workoutsResponse.results || []);
      setStats({
        totalWorkouts: statsResponse.total_workouts || 0,
        weeklyWorkouts: statsResponse.workouts_this_week || 0,
        currentStreak: statsResponse.current_streak || 0,
        totalMinutes: statsResponse.total_duration || 0,
        workoutTypes: statsResponse.workout_types || [],
        monthlyStats: statsResponse.monthly_trends || [],
      });
    } catch (err) {
      setError(err.message || 'Profile not found');
      toast.error('Error fetching profile data');
    } finally {
      setLoading(false);
    }
  }, [id, currentUser]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData, currentUser]);

  // Helper function for workout intensity colors
  const intensityColor = (intensity) => {
    switch (intensity) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'moderate': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-green-500/20 text-green-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-8 w-8 text-green-500 animate-spin" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center p-6">
          <h2 className="text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-400">{error || 'Profile not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center">
              <Avatar src={profileData.profile_image} alt={`${profileData.username}'s avatar`} />
            </div>

            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {profileData.username}'s Profile
                  </h1>
                  <p className="text-gray-400 mt-1">Member since {
                    new Date(profileData.date_joined).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })
                  }</p>
                </div>
                {isOwnProfile && (
                  <button
                    onClick={() => navigate(`/profiles/${id}/edit`)}
                    className="px-4 py-2 text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                )}
              </div>
              <div className="mt-4 text-gray-400">
                <p><strong>Bio:</strong> {profileData.bio || 'No bio provided'}</p>
                <p><strong>Weight:</strong> {profileData.weight ? `${profileData.weight} kg` : 'Not specified'}</p>
                <p><strong>Height:</strong> {profileData.height ? `${profileData.height} cm` : 'Not specified'}</p>
                <p><strong>Gender:</strong> {
                  profileData.gender === 'M' ? 'Male' : 
                  profileData.gender === 'F' ? 'Female' : 
                  'Not specified'
                }</p>
                <p><strong>Date of Birth:</strong> {
                  profileData.date_of_birth ? 
                  new Date(profileData.date_of_birth).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  }) : 
                  'Not specified'
                }</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { id: 'total', icon: DumbbellIcon, label: 'Total Workouts', value: stats.totalWorkouts, color: 'green' },
            { id: 'weekly', icon: Clock, label: 'This Week', value: stats.weeklyWorkouts, color: 'blue' },
            { id: 'streak', icon: Award, label: 'Current Streak', value: `${stats.currentStreak} days`, color: 'yellow' },
            { id: 'minutes', icon: Activity, label: 'Total Minutes', value: stats.totalMinutes, color: 'purple' },
          ].map(card => (
            <div key={card.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className={`inline-flex p-3 rounded-lg bg-${card.color}-500/20 mb-4`}>
                <card.icon className={`h-6 w-6 text-${card.color}-500`} />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{card.value}</p>
              <p className="text-sm text-gray-400">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Workouts */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Recent Workouts</h2>
            <button
              onClick={() => navigate('/workouts')}
              className="text-sm text-gray-400 hover:text-white"
            >
              View All
            </button>
          </div>

          {workouts.length > 0 ? (
            <div className="space-y-4">
              {workouts.map((workout) => (
                <div key={workout.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700">
                  <div className="flex-1">
                    <h3 className="font-medium text-white mb-1">{workout.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                        {workout.workout_type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-sm ${intensityColor(workout.intensity)}`}>
                        {workout.intensity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-300">{workout.duration} mins</p>
                    <p className="text-sm text-gray-400">
                      {new Date(workout.date_logged).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <DumbbellIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No workouts logged yet</p>
              {isOwnProfile && (
                <button
                  onClick={() => navigate('/workouts/create')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <PlusCircle className="h-5 w-5" />
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