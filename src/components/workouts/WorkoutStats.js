import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { workoutService } from '../../services/workoutService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, Dumbbell, Award, TrendingUp, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const WorkoutStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Memoized fetch function
  const fetchStats = useCallback(async (showToast = false) => {
    try {
      setLoading(true);
      const response = await workoutService.getWorkoutStatistics();
      setStats(response);
      setError(null);
      setLastUpdated(new Date());
      if (showToast) {
        toast.success('Statistics updated');
      }
    } catch (err) {
      setError('Failed to load workout statistics');
      toast.error('Failed to load workout statistics');
      console.error('Stats fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect for initial load and periodic updates
  useEffect(() => {
    fetchStats();

    // Set up interval for periodic updates
    const intervalId = setInterval(() => fetchStats(true), 5 * 60 * 1000);

    // Set up event listener for workout updates
    const handleWorkoutUpdate = () => {
      fetchStats(true);
    };
    
    window.addEventListener('workout-updated', handleWorkoutUpdate);

    // Cleanup
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('workout-updated', handleWorkoutUpdate);
    };
  }, [fetchStats]);

  // Memoized summary cards data
  const summaryCards = useMemo(() => [
    {
      title: "Current Streak",
      value: `${stats?.current_streak || 0} days`,
      icon: Award,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      description: "Keep it going!",
      trend: stats?.current_streak > (stats?.previous_streak || 0) ? 'up' : 'down'
    },
    {
      title: "Longest Streak",
      value: `${stats?.longest_streak || 0} days`,
      icon: TrendingUp,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      description: "Personal best"
    },
    {
      title: "Total Workouts",
      value: stats?.total_workouts || 0,
      icon: Dumbbell,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      description: "All time"
    },
    {
      title: "Active Days",
      value: stats?.total_active_days || 0,
      icon: Calendar,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      description: "Days with workouts"
    }
  ], [stats]);

  // Memoized chart data
  const chartData = useMemo(() => ({
    monthlyTrends: stats?.monthly_trends?.map(trend => ({
      ...trend,
      month: new Date(trend.month).toLocaleDateString('en-US', { month: 'short' })
    })) || [],
    workoutTypes: stats?.workout_types || []
  }), [stats]);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => fetchStats(true)}
            className="px-4 py-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workout Statistics</h1>
          <p className="text-gray-600">
            Track your progress and achievements
            {lastUpdated && (
              <span className="text-sm ml-2">
                (Last updated: {lastUpdated.toLocaleTimeString()})
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => fetchStats(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          disabled={loading}
        >
          <Activity className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-lg shadow-lg transition-all hover:shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 ${card.bgColor} rounded-lg`}>
                <card.icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
              <div>
                <h3 className="text-gray-600 text-sm">{card.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-500">{card.description}</p>
                {card.trend && (
                  <div className={`text-xs ${card.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {card.trend === 'up' ? '↑' : '↓'} from last week
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      {loading ? (
        <div className="flex justify-center items-center h-80">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Workout Duration Trend */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Workout Duration Trend</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="duration" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: "#10B981" }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Workout Types Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Workout Types Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.workoutTypes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="type"
                    tick={{ fontSize: 12 }}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#10B981" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutStats;