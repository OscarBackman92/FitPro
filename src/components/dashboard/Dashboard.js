import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DumbbellIcon, 
  Activity, 
  Target, 
  Users, 
  BarChart3,
  PlusSquare,
  Calendar,
  Award
} from 'lucide-react';
import { format } from 'date-fns';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { workoutService } from '../../services/workoutService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    workoutsThisWeek: 0,
    activeGoals: 0,
    totalMinutes: 0,
    currentStreak: 0
  });
  const [recentWorkouts, setRecentWorkouts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [workoutsRes, statsRes] = await Promise.all([
          workoutService.getWorkouts(),
          workoutService.getWorkoutStatistics()
        ]);
        
        setRecentWorkouts(workoutsRes.results || []);
        setStats({
          workoutsThisWeek: workoutsRes.results.length,
          activeGoals: statsRes.active_goals || 0,
          totalMinutes: workoutsRes.results.reduce((total, w) => total + w.duration, 0),
          currentStreak: statsRes.current_streak || 0
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const QuickAction = ({ icon: Icon, label, onClick, color = "green" }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-6 bg-gray-800 rounded-xl 
        hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl
        border border-gray-700`}
    >
      <div className={`p-3 rounded-lg bg-${color}-500/20 text-${color}-500 mb-3`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-sm font-medium text-gray-300">{label}</span>
    </button>
  );

  const StatCard = ({ icon: Icon, label, value, color = "green" }) => (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
      <div className={`p-3 rounded-lg bg-${color}-500/20 text-${color}-500 mb-4 w-fit`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-3xl font-bold text-white mb-2">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome back, {currentUser?.username}! 👋
        </h1>
        <p className="text-gray-400">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <QuickAction 
          icon={PlusSquare} 
          label="Log Workout" 
          onClick={() => navigate('/workouts/create')}
          color="green"
        />
        <QuickAction 
          icon={Target} 
          label="Set Goals" 
          onClick={() => navigate('/goals')}
          color="blue"
        />
        <QuickAction 
          icon={Users} 
          label="Social Feed" 
          onClick={() => navigate('/feed')}
          color="purple"
        />
        <QuickAction 
          icon={Activity} 
          label="Progress" 
          onClick={() => navigate('/progress')}
          color="orange"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          icon={DumbbellIcon}
          label="Workouts This Week"
          value={stats.workoutsThisWeek}
          color="green"
        />
        <StatCard 
          icon={Calendar}
          label="Active Goals"
          value={stats.activeGoals}
          color="blue"
        />
        <StatCard 
          icon={Award}
          label="Current Streak"
          value={`${stats.currentStreak} days`}
          color="purple"
        />
        <StatCard 
          icon={BarChart3}
          label="Total Minutes"
          value={stats.totalMinutes}
          color="orange"
        />
      </div>

      {/* Recent Workouts Section */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Recent Workouts</h2>
          <button 
            onClick={() => navigate('/workouts')}
            className="text-green-500 hover:text-green-400 text-sm font-medium transition-colors"
          >
            View All
          </button>
        </div>

        {recentWorkouts.length === 0 ? (
          <div className="text-center py-12">
            <DumbbellIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No workouts logged yet</p>
            <button
              onClick={() => navigate('/workouts/create')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <PlusSquare className="w-5 h-5" />
              Log Your First Workout
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentWorkouts.slice(0, 5).map((workout) => (
              <div 
                key={workout.id}
                onClick={() => navigate(`/workouts/${workout.id}`)}
                className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
              >
                <div className="h-10 w-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <DumbbellIcon className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">{workout.workout_type}</h3>
                  <p className="text-sm text-gray-400">
                    {format(new Date(workout.date_logged), 'MMM d')} • {workout.duration} minutes
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium
                  ${workout.intensity === 'high' 
                    ? 'bg-red-500/20 text-red-500' 
                    : workout.intensity === 'moderate'
                    ? 'bg-yellow-500/20 text-yellow-500'
                    : 'bg-green-500/20 text-green-500'
                  }`}
                >
                  {workout.intensity}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;