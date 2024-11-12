// src/components/dashboard/Dashboard.js
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
  Award,
  Newspaper
} from 'lucide-react';
import { format } from 'date-fns';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { workoutService } from '../../services/workoutService';
import { socialService } from '../../services/socialService';
import Avatar from '../common/Avatar';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    workoutsThisWeek: 0,
    activeGoals: 0,
    totalMinutes: 0,
    currentStreak: 0,
    followers: 0,
    following: 0
  });
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [recentSocialActivity, setRecentSocialActivity] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [workoutsRes, statsRes, socialStats, socialActivity] = await Promise.all([
          workoutService.getWorkouts(),
          workoutService.getWorkoutStatistics(),
          socialService.getSocialStats(currentUser.id),
          socialService.getFeed(1, 3) // Get just 3 recent social items
        ]);
        
        setRecentWorkouts(workoutsRes.results || []);
        setRecentSocialActivity(socialActivity.results || []);
        setStats({
          workoutsThisWeek: workoutsRes.results.length,
          activeGoals: statsRes.active_goals || 0,
          totalMinutes: workoutsRes.results.reduce((total, w) => total + w.duration, 0),
          currentStreak: statsRes.current_streak || 0,
          followers: socialStats.followers_count || 0,
          following: socialStats.following_count || 0
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        toast.error('Error loading dashboard data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [currentUser.id]);

  // Social Stats Quick Action Cards
  const socialQuickActions = [
    {
      title: 'Social Feed',
      icon: Newspaper,
      action: () => navigate('/feed'),
      color: 'purple',
      count: recentSocialActivity.length
    },
    {
      title: 'Followers',
      icon: Users,
      action: () => navigate(`/profiles/${currentUser.id}/followers`),
      color: 'blue',
      count: stats.followers
    },
    {
      title: 'Following',
      icon: Users,
      action: () => navigate(`/profiles/${currentUser.id}/following`),
      color: 'green',
      count: stats.following
    }
  ];

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
          icon={Newspaper} 
          label="Social Feed" 
          onClick={() => navigate('/feed')}
          color="purple"
          badge={recentSocialActivity.length}
        />
        <QuickAction 
          icon={Activity} 
          label="Progress" 
          onClick={() => navigate('/progress')}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Workout Stats */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

          {/* Recent Workouts */}
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
            {/* Workout List Component */}
            {recentWorkouts.length > 0 ? (
              <div className="space-y-4">
                {recentWorkouts.slice(0, 3).map((workout) => (
                  <WorkoutCard key={workout.id} workout={workout} navigate={navigate} />
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={DumbbellIcon}
                message="No workouts logged yet"
                actionLabel="Log Your First Workout"
                onAction={() => navigate('/workouts/create')}
              />
            )}
          </div>
        </div>

        {/* Right Column: Social Feed */}
        <div className="space-y-8">
          {/* Social Stats */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-6">Social Activity</h2>
            <div className="grid grid-cols-1 gap-4">
              {socialQuickActions.map(({ title, icon: Icon, action, color, count }) => (
                <button
                  key={title}
                  onClick={action}
                  className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-${color}-500/20 rounded-lg`}>
                      <Icon className={`h-5 w-5 text-${color}-500`} />
                    </div>
                    <span>{title}</span>
                  </div>
                  {count > 0 && (
                    <span className="px-2 py-1 bg-gray-600 rounded-full text-sm">
                      {count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Social Activity */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Recent Activity</h2>
              <button 
                onClick={() => navigate('/feed')}
                className="text-green-500 hover:text-green-400 text-sm font-medium transition-colors"
              >
                View Full Feed
              </button>
            </div>
            {recentSocialActivity.length > 0 ? (
              <div className="space-y-4">
                {recentSocialActivity.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} navigate={navigate} />
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={Users}
                message="No social activity yet"
                actionLabel="Find People to Follow"
                onAction={() => navigate('/discover')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const QuickAction = ({ icon: Icon, label, onClick, color = "green", badge }) => (
  <button
    onClick={onClick}
    className={`relative flex flex-col items-center justify-center p-6 bg-gray-800 rounded-xl 
      hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl
      border border-gray-700`}
  >
    <div className={`p-3 rounded-lg bg-${color}-500/20 text-${color}-500 mb-3`}>
      <Icon className="w-6 h-6" />
    </div>
    <span className="text-sm font-medium text-gray-300">{label}</span>
    {badge > 0 && (
      <span className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded-full text-xs">
        {badge}
      </span>
    )}
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

const WorkoutCard = ({ workout, navigate }) => (
  <div
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
);

const ActivityCard = ({ activity, navigate }) => (
  <div className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg">
    <Avatar
      src={activity.user.profile_image}
      text={activity.user.username}
      height={40}
    />
    <div className="flex-1">
      <p className="text-sm">
        <span className="font-medium text-white">{activity.user.username}</span>
        <span className="text-gray-400"> {activity.action} </span>
        <span className="text-green-500 cursor-pointer" onClick={() => navigate(`/workouts/${activity.workout_id}`)}>
          a workout
        </span>
      </p>
      <p className="text-xs text-gray-500">{format(new Date(activity.created_at), 'MMM d, h:mm a')}</p>
    </div>
  </div>
);

const EmptyState = ({ icon: Icon, message, actionLabel, onAction }) => (
  <div className="text-center py-8">
    <Icon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
    <p className="text-gray-400 mb-4">{message}</p>
    <button
      onClick={onAction}
      className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
    >
      {actionLabel}
    </button>
  </div>
);

export default Dashboard;