import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { 
  Edit2, Shield, Lock, MapPin, Activity, 
  Award, DumbbellIcon, Calendar, ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import Avatar from '../common/Avatar';
import LoadingSpinner from '../common/LoadingSpinner';
import { axiosReq } from '../../services/axiosDefaults';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workouts, setWorkouts] = useState([]);

  const isOwnProfile = currentUser?.profile?.id === parseInt(id);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [profileData, statsData, workoutsData] = await Promise.all([
          axiosReq.get(`/api/profiles/${id}/`),
          axiosReq.get('/api/workouts/statistics/'),
          axiosReq.get('/api/workouts/', { params: { limit: 5 } })
        ]);

        setProfile(profileData.data);
        setStats(statsData.data);
        setWorkouts(workoutsData.data.results);
      } catch (err) {
        toast.error('Failed to load profile');
        if (err.response?.status === 404) navigate('/404');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id, navigate]);

  if (loading) return <LoadingSpinner centered />;

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-gray-900/50" />

      <div className="relative px-4 py-8 max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <Avatar
              src={profile?.profile_image}
              text={profile?.username}
              size="xl"
              className="w-32 h-32 ring-4 ring-gray-700"
            />
            
            {/* Basic Info */}
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                {profile?.name || profile?.username}
                {profile?.is_verified && <Shield className="h-4 w-4 text-blue-500" />}
              </h1>
              <p className="text-gray-400">@{profile?.username}</p>
              {profile?.bio && <p className="text-gray-300 mt-2">{profile?.bio}</p>}
              
              {isOwnProfile && (
                <button
                  onClick={() => navigate(`/profiles/${id}/edit`)}
                  className="mt-4 px-4 py-2 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  <Edit2 className="h-4 w-4 inline mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Personal Info</h2>
            <Lock className="h-4 w-4 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {[
              { label: 'Member Since', value: format(new Date(profile?.created_at), 'MMMM yyyy'), icon: Calendar },
              { label: 'Location', value: profile?.location || 'Not set', icon: MapPin },
              { label: 'Total Workouts', value: stats?.total_workouts || 0, icon: DumbbellIcon },
              { label: 'Current Streak', value: `${stats?.current_streak || 0} days`, icon: Award }
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">{item.label}</span>
                </div>
                <span className="text-white font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Workouts */}
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Workouts</h2>
            <button onClick={() => navigate('/workouts')} className="text-green-500 hover:text-green-400">
              View all <ChevronRight className="h-4 w-4 inline" />
            </button>
          </div>

          {workouts.length > 0 ? (
            <div className="space-y-3">
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  onClick={() => navigate(`/workouts/${workout.id}`)}
                  className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <Activity className={`h-4 w-4 ${
                      workout.intensity === 'high' ? 'text-red-500' : 
                      workout.intensity === 'moderate' ? 'text-yellow-500' : 
                      'text-green-500'
                    }`} />
                    <div>
                      <p className="text-white">{workout.workout_type}</p>
                      <p className="text-sm text-gray-400">{format(new Date(workout.date_logged), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                  <span className="text-white">{workout.duration} mins</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <DumbbellIcon className="h-12 w-12 mx-auto mb-3" />
              <p>No workouts recorded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;