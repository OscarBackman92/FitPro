import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { axiosReq } from '../../services/axiosDefaults';
import { 
  Edit2, 
  Activity,
  Calendar,
  MapPin,
  Users,
  Scale,
  Award,
  Clock,
  Target
} from 'lucide-react';
import Avatar from '../common/Avatar';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const [profile, setProfile] = useState(null);
  const [workoutStats, setWorkoutStats] = useState(null);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwner = currentUser?.profile?.id === parseInt(id);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileRes, statsRes, workoutsRes] = await Promise.all([
          axiosReq.get(`/api/profiles/${id}/`),
          axiosReq.get('/api/workouts/statistics/'),
          axiosReq.get(`/api/workouts/?user=${id}&limit=5`)
        ]);

        setProfile(profileRes.data);
        setWorkoutStats(statsRes.data);
        setRecentWorkouts(workoutsRes.data.results);
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  if (loading) return <LoadingSpinner centered />;

  const stats = [
    {
      label: 'Workouts',
      value: workoutStats?.total_workouts || 0,
      icon: Activity,
      color: 'blue'
    },
    {
      label: 'Current Streak',
      value: `${workoutStats?.current_streak || 0} days`,
      icon: Award,
      color: 'yellow'
    },
    {
      label: 'This Week',
      value: workoutStats?.workouts_this_week || 0,
      icon: Target,
      color: 'green'
    },
    {
      label: 'Time Spent',
      value: `${workoutStats?.total_duration || 0}m`,
      icon: Clock,
      color: 'purple'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Main Profile Card */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        {/* Profile Header */}
        <div className="flex items-start gap-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar
              src={profile?.profile_image}
              text={profile?.username}
              size="xl"
              className="ring-4 ring-gray-700"
            />
            {isOwner && (
              <button
                onClick={() => navigate(`/profiles/${id}/edit`)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 
                  text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </button>
            )}
          </div>

          <div className="flex-1">
            {/* Name and Basic Info */}
            <div>
              <h1 className="text-2xl font-bold text-white">
                {profile?.name || profile?.username}
              </h1>
              <p className="text-gray-400">@{profile?.username}</p>
            </div>

            {/* Bio Section */}
            <div className="mt-4">
              {profile?.bio ? (
                <p className="text-gray-300 whitespace-pre-wrap">{profile.bio}</p>
              ) : (
                <p className="text-gray-500 italic">
                  {isOwner ? 'Add a bio in profile settings' : 'No bio yet'}
                </p>
              )}
            </div>

            {/* Profile Stats */}
            <div className="flex gap-4 mt-4">
              <div className="text-center">
                <p className="text-xl font-bold text-white">{profile?.followers_count || 0}</p>
                <p className="text-sm text-gray-400">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">{profile?.following_count || 0}</p>
                <p className="text-sm text-gray-400">Following</p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {profile?.location && (
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile?.date_of_birth && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(profile.date_of_birth).toLocaleDateString()}</span>
                </div>
              )}
              {profile?.weight && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Scale className="h-4 w-4" />
                  <span>{profile.weight} kg</span>
                </div>
              )}
              {profile?.created_at && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Users className="h-4 w-4" />
                  <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center gap-4">
              <div className={`p-3 bg-${stat.color}-500/20 rounded-lg`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Workouts */}
      {recentWorkouts.length > 0 && (
        <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Recent Workouts</h2>
            <button
              onClick={() => navigate('/workouts')}
              className="text-green-500 hover:text-green-400 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentWorkouts.map((workout) => (
              <div
                key={workout.id}
                onClick={() => navigate(`/workouts/${workout.id}`)}
                className="flex items-center justify-between p-4 bg-gray-700 
                  rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
              >
                <div>
                  <p className="text-white font-medium capitalize">
                    {workout.workout_type}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(workout.date_logged).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white">{workout.duration} mins</p>
                  <p className="text-sm text-gray-400 capitalize">
                    {workout.intensity} intensity
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;