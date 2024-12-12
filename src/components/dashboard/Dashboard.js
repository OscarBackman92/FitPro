import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DumbbellIcon, 
  Calendar, 
  PlusCircle, 
  Activity, 
  Award 
} from 'lucide-react';
import { format } from 'date-fns';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import workoutService from '../../services/workoutService';
import toast from 'react-hot-toast';
import LoadingSpinner from '../common/LoadingSpinner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const [dashboardData, setDashboardData] = useState({
    workouts: [],
    stats: {
      total_workouts: 0,
      workouts_this_week: 0,
      current_streak: 0,
      total_duration: 0,
      workout_types: [],
      monthly_stats: [],
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log('Fetching dashboard data...');
      if (!currentUser) {
        navigate('/signin');
        return;
      }

      try {
        // First fetch statistics
        const statsResponse = await workoutService.getStatistics();
        console.log('Statistics fetched:', statsResponse);

        // Then fetch recent workouts
        const workoutsResponse = await workoutService.listWorkouts();
        console.log('Workouts fetched:', workoutsResponse);

        // Update dashboard data with proper structuring
        setDashboardData({
          stats: {
            total_workouts: statsResponse?.total_workouts || 0,
            workouts_this_week: statsResponse?.workouts_this_week || 0,
            current_streak: statsResponse?.current_streak || 0,
            total_duration: statsResponse?.total_duration || 0,
            workout_types: statsResponse?.workout_types || [],
            monthly_stats: statsResponse?.monthly_stats || [],
          },
          workouts: Array.isArray(workoutsResponse?.results) ? workoutsResponse.results : [],
        });

      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        if (err.response?.status === 401) {
          navigate('/signin');
        } else {
          toast.error('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, navigate]);

  const statCards = [
    {
      id: 'total',
      icon: <DumbbellIcon className="h-6 w-6 text-blue-500" />,
      label: 'Total Workouts',
      value: dashboardData.stats.total_workouts || 0,
      formatter: value => value.toString(),
    },
    {
      id: 'weekly',
      icon: <Calendar className="h-6 w-6 text-green-500" />,
      label: 'This Week',
      value: dashboardData.stats.workouts_this_week || 0,
      formatter: value => value.toString(),
    },
    {
      id: 'streak',
      icon: <Award className="h-6 w-6 text-yellow-500" />,
      label: 'Current Streak',
      value: dashboardData.stats.current_streak || 0,
      formatter: value => `${value} days`,
    },
    {
      id: 'minutes',
      icon: <Activity className="h-6 w-6 text-purple-500" />,
      label: 'Total Minutes',
      value: dashboardData.stats.total_duration || 0,
      formatter: value => value.toString(),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner color="green" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">
          Welcome, {currentUser?.username || 'User'}!
        </h1>
        <p className="text-gray-400">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
        {statCards.map((card) => (
          <div
            key={card.id}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="inline-flex p-3 rounded-lg bg-gray-700/50 mb-4">
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {card.formatter(card.value)}
            </p>
            <p className="text-sm text-gray-400">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/workouts/create')}
          className="flex items-center justify-center gap-2 p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-full sm:w-auto"
        >
          <PlusCircle className="h-5 w-5" />
          Log Workout
        </button>
        <button
          onClick={() => navigate('/workouts')}
          className="flex items-center justify-center gap-2 p-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors w-full sm:w-auto"
        >
          <Calendar className="h-5 w-5" />
          View History
        </button>
      </div>

      {/* Recent Workouts Section */}
      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <DumbbellIcon className="h-5 w-5 text-green-500" />
              <h2 className="text-xl font-bold text-white">Recent Workouts</h2>
            </div>
          </div>

          {dashboardData.workouts.length > 0 ? (
            <div className="divide-y divide-gray-700">
              {dashboardData.workouts.map((workout) => (
                <div
                  key={workout.id}
                  onClick={() => navigate(`/workouts/${workout.id}/edit`)}
                  className="flex items-center py-4 cursor-pointer hover:bg-gray-700/50 transition-colors rounded-lg px-3 -mx-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          workout.intensity === 'high'
                            ? 'bg-red-500'
                            : workout.intensity === 'moderate'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                      />
                      <h3 className="text-white capitalize font-medium">
                        {workout.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {format(new Date(workout.date_logged), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-medium">
                      {workout.duration} mins
                    </span>
                    <p className="text-sm text-gray-400 capitalize">
                      {workout.intensity} intensity
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <DumbbellIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No workouts logged yet</p>
              <button
                onClick={() => navigate('/workouts/create')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <PlusCircle className="h-5 w-5" />
                Log Your First Workout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;