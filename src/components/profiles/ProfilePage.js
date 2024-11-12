import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosReq } from '../../services/axiosDefaults';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { 
  Activity, 
  Award, 
  Calendar,
  Clock, 
  DumbbellIcon,
  Edit2 
} from 'lucide-react';
import { format } from 'date-fns';
import { WorkoutsList, GoalsList } from './ProfileComponents';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [workouts, setWorkouts] = useState({ results: [] });
  const [activeTab, setActiveTab] = useState('overview');

  const is_owner = currentUser?.profile_id === parseInt(id, 10);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [{ data: profileData }, { data: statsData }, { data: workoutsData }] = await Promise.all([
          axiosReq.get(`api/profiles/${id}/`),
          axiosReq.get(`api/profiles/${id}/stats/`),
          axiosReq.get(`api/workouts/workouts/?user=${id}`)
        ]);
        setProfile(profileData);
        setStats(statsData);
        setWorkouts(workoutsData);
        setError(null);
      } catch (err) {
        setError('Failed to load profile data');
        toast.error('Unable to load profile');
      } finally {
        setHasLoaded(true);
      }
    };

    setHasLoaded(false);
    fetchProfileData();
  }, [id]);

  if (!hasLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-500/10 rounded-lg text-red-500">
        {error}
      </div>
    );
  }

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center gap-4">
        <div className={`p-3 bg-${color}-500/20 rounded-lg`}>
          <Icon className={`h-6 w-6 text-${color}-500`} />
        </div>
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );

  const tabClasses = (isActive) => `
    py-4 px-6 font-medium text-sm cursor-pointer transition-colors
    ${isActive 
      ? 'text-green-500 border-b-2 border-green-500' 
      : 'text-gray-400 hover:text-gray-300 border-b-2 border-transparent'
    }
  `;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Profile Image */}
            <div className="relative">
              <img
                src={profile?.profile_image || '/default-avatar.png'}
                alt={profile?.name || profile?.username}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{profile?.name || profile?.username}</h1>
                  <p className="text-gray-400 mt-1">{profile?.bio}</p>
                  <div className="flex items-center gap-2 mt-2 text-gray-400">
                    <Clock className="h-4 w-4" />
                    Joined {format(new Date(profile?.created_at), 'MMMM yyyy')}
                  </div>
                </div>

                {is_owner && (
                  <button
                    onClick={() => navigate(`/profiles/${id}/edit`)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg 
                      hover:bg-gray-600 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={DumbbellIcon}
            label="Total Workouts"
            value={stats?.total_workouts || 0}
            color="blue"
          />
          <StatCard
            icon={Activity}
            label="Current Streak"
            value={`${stats?.current_streak || 0} days`}
            color="green"
          />
          <StatCard
            icon={Award}
            label="Goals Completed"
            value={stats?.completed_goals || 0}
            color="purple"
          />
          <StatCard
            icon={Calendar}
            label="Progress Rate"
            value={`${stats?.progress_rate || 0}%`}
            color="orange"
          />
        </div>

        {/* Tabs Navigation */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="border-b border-gray-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={tabClasses(activeTab === 'overview')}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('workouts')}
                className={tabClasses(activeTab === 'workouts')}
              >
                Workouts
              </button>
              <button
                onClick={() => setActiveTab('goals')}
                className={tabClasses(activeTab === 'goals')}
              >
                Goals
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Profile Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="font-medium text-white mb-2">Personal Info</h3>
                    <div className="space-y-2 text-gray-300">
                      <p>Height: {profile?.height || 'Not set'} cm</p>
                      <p>Weight: {profile?.weight || 'Not set'} kg</p>
                      <p>Gender: {profile?.gender || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="font-medium text-white mb-2">Recent Activity</h3>
                    {workouts.results.slice(0, 3).length > 0 ? (
                      <WorkoutsList 
                        workouts={workouts.results.slice(0, 3)} 
                        navigate={navigate}
                      />
                    ) : (
                      <p className="text-gray-400">No recent activity</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'workouts' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Workout History</h2>
                  {is_owner && (
                    <button
                      onClick={() => navigate('/workouts/create')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                        transition-colors flex items-center gap-2"
                    >
                      <DumbbellIcon className="h-4 w-4" />
                      Log Workout
                    </button>
                  )}
                </div>
                <WorkoutsList 
                  workouts={workouts.results} 
                  navigate={navigate}
                />
              </div>
            )}

            {activeTab === 'goals' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Fitness Goals</h2>
                  {is_owner && (
                    <button
                      onClick={() => navigate('/goals/create')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                        transition-colors flex items-center gap-2"
                    >
                      <Award className="h-4 w-4" />
                      Set New Goal
                    </button>
                  )}
                </div>
                <GoalsList goals={profile?.goals || []} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;