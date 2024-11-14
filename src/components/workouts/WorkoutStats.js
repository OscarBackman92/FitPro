import React, { useState, useEffect } from 'react';
import { workoutService } from '../../services/workoutService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, Dumbbell, Award, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const WorkoutStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await workoutService.getWorkoutStatistics();
        setStats(response);
        setError(null);
      } catch (err) {
        setError('Failed to load workout statistics');
        toast.error('Failed to load workout statistics');
      } finally {
        setLoading(false);
      }
    };

    // Fetch initially
    fetchStats();

    // Set up interval to refresh stats periodically (every 5 minutes)
    const intervalId = setInterval(fetchStats, 5 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  // Card data for summary statistics
  const summaryCards = [
    {
      title: "Current Streak",
      value: `${stats?.current_streak || 0} days`,
      icon: Award,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      description: "Keep it going!"
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
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Workout Statistics</h1>
        <p className="text-gray-600">Track your progress and achievements</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-4">
              <div className={`p-3 ${card.bgColor} rounded-lg`}>
                <card.icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
              <div>
                <h3 className="text-gray-600 text-sm">{card.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-500">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Workout Duration Trend */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Workout Duration Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.monthly_trends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="duration" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: "#10B981" }}
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
              <BarChart data={stats?.workout_types || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutStats;