import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { 
  DumbbellIcon, 
  Activity,
  Award,
  Clock,
  PlusCircle,
  Edit2
} from 'lucide-react';
import { format } from 'date-fns';
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

  // Check if the profile being viewed is the logged-in user's profile
  const isOwnProfile = currentUser?.id === parseInt(id);
  const fetchProfile = useCallback(async () => {
    try {
      const response = await profileService.getProfile(id); // Fetch the profile by ID
      setProfileData(response);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  }, [id])
  // Memoized fetchProfile function to prevent unnecessary re-renders
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Get recent workouts for this user
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    weeklyWorkouts: 0,
    currentStreak: 0,
    totalMinutes: 0,
    workoutTypes: [],
    monthlyStats: []
  });

  // Fetch profile data when component mounts or `id` changes
  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const [workoutsResponse, statsResponse] = await Promise.all([
          workoutService.getWorkouts({ limit: 5 }),
          workoutService.getWorkoutStatistics()
        ]);

        setWorkouts(workoutsResponse.results || []);
        setStats({
          totalWorkouts: statsResponse.total_workouts || 0,
          weeklyWorkouts: statsResponse.workouts_this_week || 0,
          currentStreak: statsResponse.current_streak || 0,
          totalMinutes: statsResponse.total_duration || 0,
          workoutTypes: statsResponse.workout_types || [],
          monthlyStats: statsResponse.monthly_trends || []
        });
      } catch (err) {
        toast.error('Failed to load dashboard data');
      }
    };

    fetchWorkoutData();
  }, []);


  // Helper function to determine workout intensity color
  const intensityColor = (intensity) => {
    switch (intensity) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'moderate': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-green-500/20 text-green-400';
    }
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }

  const dateJoined = new Date(profileData.date_joined);
  const formattedDate = dateJoined instanceof Date && !isNaN(dateJoined) ? format(dateJoined, 'MMMM yyyy') : 'Invalid Date';

  return (
    <div className="max-w-6xl mx-auto p-6">
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
                <p className="text-gray-400 mt-1">Member since {formattedDate}</p>
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
              <p><strong>Bio:</strong> {profileData.bio}</p>
              <p><strong>Weight:</strong> {profileData.weight} kg</p>
              <p><strong>Height:</strong> {profileData.height} cm</p>
              <p><strong>Gender:</strong> {profileData.gender === 'M' ? 'Male' : profileData.gender === 'F' ? 'Female' : 'Other'}</p>
              <p><strong>Date of Birth:</strong> {format(new Date(profileData.date_of_birth), 'MMMM dd, yyyy')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <DumbbellIcon className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Workouts</p>
              <p className="text-xl font-bold text-white">{stats.totalWorkouts}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Avg Duration</p>
              <p className="text-xl font-bold text-white">{stats.avgDuration} mins</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Award className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Current Streak</p>
              <p className="text-xl font-bold text-white">{stats.currentStreak} days</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Activity className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Minutes</p>
              <p className="text-xl font-bold text-white">{stats.totalDuration}</p>
            </div>
          </div>
        </div>
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
                    <span className={`px-2 py-1 rounded-full text-sm ${intensityColor(workout.intensity)}`} >
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
          <div className="text-center py-12">
            <DumbbellIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No workouts recorded yet</p>
            <button
              onClick={() => navigate('/workouts/create')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <PlusCircle className="h-5 w-5" />
              Log Your First Workout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
