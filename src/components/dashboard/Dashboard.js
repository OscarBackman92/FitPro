import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { workoutService } from '../../services/workoutService';
import { goalsService } from '../../services/goalsService';
import { 
  TrendingUp, 
  Plus, 
  History, 
  Target,
  Users,
  Calendar,
  Dumbbell,
  ChevronRight
} from 'lucide-react';

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
        const [workoutsRes, statsRes, goalsRes] = await Promise.all([
          workoutService.getWorkouts(),
          workoutService.getWorkoutStatistics(),
          goalsService.getGoals({ status: 'active' })
        ]);

        const workouts = workoutsRes.results || [];
        const activeGoals = goalsRes.results?.filter(goal => !goal.completed) || [];
        
        setRecentWorkouts(workouts);
        setStats({
          workoutsThisWeek: workouts.length,
          activeGoals: activeGoals.length,
          totalMinutes: workouts.reduce((total, workout) => total + (workout.duration || 0), 0),
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const actionCards = [
    {
      title: 'Track Workout',
      description: 'Log your latest fitness activity',
      icon: <Plus className="h-6 w-6" />,
      bgColor: 'bg-green-500',
      onClick: () => navigate('/workouts/create')
    },
    {
      title: 'My Workouts',
      description: `${stats.workoutsThisWeek} workouts logged`,
      icon: <History className="h-6 w-6" />,
      bgColor: 'bg-blue-500',
      onClick: () => navigate('/workouts')
    },
    {
      title: 'Active Goals',
      description: `${stats.activeGoals} goals in progress`,
      icon: <Target className="h-6 w-6" />,
      bgColor: 'bg-purple-500',
      onClick: () => navigate('/goals')
    },
    {
      title: 'Community',
      description: 'Connect with other fitness enthusiasts',
      icon: <Users className="h-6 w-6" />,
      bgColor: 'bg-orange-500',
      onClick: () => navigate('/social-feed')
    }
  ];

  const quickStats = [
    {
      label: 'Workouts This Week',
      value: stats.workoutsThisWeek
    },
    {
      label: 'Active Goals',
      value: stats.activeGoals
    },
    {
      label: 'Total Minutes',
      value: stats.totalMinutes
    },
    {
      label: 'Current Streak',
      value: `${stats.currentStreak} days`
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {getGreeting()}, {currentUser?.username}! 👋
        </h1>
        <p className="text-gray-500 mt-2">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {actionCards.map((card, index) => (
          <div
            key={index}
            onClick={card.onClick}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 
                     cursor-pointer hover:shadow-md transition-all group"
          >
            <div className={`${card.bgColor} text-white rounded-full p-3 inline-flex 
                          mb-4 group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
            <p className="text-gray-500 text-sm">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Workouts */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 flex justify-between items-center border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Recent Workouts</h2>
            <button 
              onClick={() => navigate('/workouts')}
              className="text-green-500 hover:text-green-600 font-medium flex items-center gap-1"
            >
              View All
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : recentWorkouts.length > 0 ? (
              <div className="space-y-4">
                {recentWorkouts.map((workout) => (
                  <div 
                    key={workout.id}
                    onClick={() => navigate(`/workouts/${workout.id}`)}
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 
                             cursor-pointer transition-colors"
                  >
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Dumbbell className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{workout.workout_type}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(workout.date_logged), 'MMM d')}</span>
                        <span>•</span>
                        <span>{workout.duration} minutes</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${workout.intensity === 'high' 
                        ? 'bg-red-100 text-red-800' 
                        : workout.intensity === 'moderate'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {workout.intensity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No workouts logged yet</p>
                <button
                  onClick={() => navigate('/workouts/create')}
                  className="text-green-500 hover:text-green-600 font-medium"
                >
                  Log Your First Workout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 flex items-center justify-between border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Quick Stats</h2>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          
          <div className="p-6 space-y-6">
            {quickStats.map((stat, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">{stat.label}</span>
                  <span className="text-xl font-bold text-gray-900">{stat.value}</span>
                </div>
                {index < quickStats.length - 1 && (
                  <div className="h-px bg-gray-100"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;