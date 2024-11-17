import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DumbbellIcon, 
  Calendar, 
  PlusCircle,
  Activity,
  Award,
} from 'lucide-react';
import { format } from 'date-fns';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { workoutService } from '../../services/workoutService';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    weeklyWorkouts: 0,
    currentStreak: 0,
    totalMinutes: 0,
    workoutTypes: [],
    monthlyStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      id: 'total',
      icon: DumbbellIcon,
      label: 'Total Workouts',
      value: stats.totalWorkouts,
      color: 'blue'
    },
    {
      id: 'weekly',
      icon: Calendar,
      label: 'This Week',
      value: stats.weeklyWorkouts,
      color: 'green'
    },
    {
      id: 'streak',
      icon: Award,
      label: 'Current Streak',
      value: `${stats.currentStreak} days`,
      color: 'yellow'
    },
    {
      id: 'minutes',
      icon: Activity,
      label: 'Total Minutes',
      value: stats.totalMinutes,
      color: 'purple'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {currentUser?.username}!
        </h1>
        <p className="text-gray-400">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(card => (
          <div
            key={card.id}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className={`inline-flex p-3 rounded-lg bg-${card.color}-500/20 mb-4`}>
              <card.icon className={`h-6 w-6 text-${card.color}-500`} />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{card.value}</p>
            <p className="text-sm text-gray-400">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => navigate('/workouts/create')}
          className="flex items-center justify-center gap-2 p-4 bg-green-500 
            text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          Log Workout
        </button>
        <button
          onClick={() => navigate('/workouts')}
          className="flex items-center justify-center gap-2 p-4 bg-gray-800 
            text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Calendar className="h-5 w-5" />
          View History
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Workouts */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <DumbbellIcon className="h-5 w-5 text-green-500" />
            <h2 className="text-xl font-bold text-white">Recent Workouts</h2>
          </div>
        </div>

        {workouts.length > 0 ? (
          <div className="divide-y divide-gray-700">
            {workouts.slice(0, 5).map(workout => (
              <div
                key={workout.id}
                onClick={() => navigate(`/workouts/${workout.id}`)}
                className="flex items-center py-4 cursor-pointer hover:bg-gray-700/50 
                  transition-colors rounded-lg px-3 -mx-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      workout.intensity === 'high' 
                        ? 'bg-red-500' 
                        : workout.intensity === 'moderate'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`} />
                    <h3 className="text-white capitalize font-medium">
                      {workout.workout_type}
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 
                text-white rounded-lg hover:bg-green-600 transition-colors"
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