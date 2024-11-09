import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

        // Calculate the week's workouts
        const workouts = workoutsRes.results || [];
        
        setRecentWorkouts(workouts);
        setStats({
          workoutsThisWeek: workouts.length,
          activeGoals: statsRes.active_goals || 0,
          totalMinutes: workouts.reduce((total, workout) => total + workout.duration, 0),
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

  // Get appropriate greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {getGreeting()}, {currentUser?.username}! 👋
        </h1>
        <p className="text-gray-500 mt-2">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Track Workout */}
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="mb-4 bg-green-500 w-12 h-12 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Track Workout</h3>
          <p className="text-gray-600 text-sm">Log your latest fitness activity</p>
        </div>

        {/* My Workouts */}
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="mb-4 bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">My Workouts</h3>
          <p className="text-gray-600 text-sm">{stats.workoutsThisWeek} workouts logged</p>
        </div>

        {/* Active Goals */}
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="mb-4 bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Active Goals</h3>
          <p className="text-gray-600 text-sm">{stats.activeGoals} goals in progress</p>
        </div>

        {/* Community */}
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="mb-4 bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Community</h3>
          <p className="text-gray-600 text-sm">Connect with other fitness enthusiasts</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Workouts */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 flex justify-between items-center border-b">
            <h2 className="text-xl font-bold">Recent Workouts</h2>
            <button 
              onClick={() => navigate('/workouts')}
              className="text-green-500 hover:text-green-600"
            >
              View All
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
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{workout.workout_type}</h3>
                      <p className="text-sm text-gray-500">
                        {format(new Date(workout.date_logged), 'MMM d')} • {workout.duration} minutes
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm
                      ${workout.intensity === 'high' ? 'bg-red-100 text-red-800' : 
                        workout.intensity === 'moderate' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {workout.intensity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No workouts logged yet</p>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Quick Stats</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Workouts This Week</span>
                <span className="font-bold">{stats.workoutsThisWeek}</span>
              </div>
              <div className="h-px bg-gray-100"></div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Active Goals</span>
                <span className="font-bold">{stats.activeGoals}</span>
              </div>
              <div className="h-px bg-gray-100"></div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Total Minutes</span>
                <span className="font-bold">{stats.totalMinutes}</span>
              </div>
              <div className="h-px bg-gray-100"></div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Current Streak</span>
                <span className="font-bold">{stats.currentStreak} days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;