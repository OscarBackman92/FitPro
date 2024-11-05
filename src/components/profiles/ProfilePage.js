import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, XAxis, YAxis, CartesianGrid, Line, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { axiosReq } from '../../api/axiosDefaults';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

const ProfilePage = () => {
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [workouts, setWorkouts] = useState({ results: [] });

  const is_owner = currentUser?.profile_id === parseInt(id, 10);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [{ data: profileData }, { data: statsData }, { data: workoutsData }] = await Promise.all([
          axiosReq.get(`/profiles/${id}/`),
          axiosReq.get(`/profiles/${id}/stats/`),
          axiosReq.get(`/workouts/workouts/?user=${id}`)
        ]);
        setProfile(profileData);
        setStats(statsData);
        setWorkouts(workoutsData);
        setError(null);
      } catch (err) {
        console.error('[ProfilePage] Error fetching profile data:', err);
        setError('Failed to load profile data');
      } finally {
        setHasLoaded(true);
      }
    };

    setHasLoaded(false);
    fetchProfileData();
  }, [id]);

  if (!hasLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-50 rounded-lg text-red-600">
        {error}
      </div>
    );
  }

  const chartData = workouts.results
    .slice(0, 7)
    .map(workout => ({
      date: format(new Date(workout.date_logged), 'MMM d'),
      duration: workout.duration,
      calories: workout.calories,
    }))
    .reverse();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={profile?.profile_image || '/default-avatar.png'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-green-500"
              />
              {is_owner && (
                <button
                  onClick={() => navigate(`/profiles/${id}/edit`)}
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile?.name || profile?.username}</h1>
              <p className="text-gray-600 mt-1">{profile?.bio}</p>
              <div className="mt-2 flex items-center space-x-4">
                <span className="text-sm text-gray-500">Joined {format(new Date(profile?.created_at), 'MMM yyyy')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-gray-500 text-sm font-medium">Total Workouts</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{stats?.total_workouts || 0}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-gray-500 text-sm font-medium">Total Duration</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{Math.round((stats?.total_duration || 0) / 60)} hrs</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-gray-500 text-sm font-medium">Total Calories</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{stats?.total_calories || 0}</p>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Overview</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="duration" stroke="#8884d8" name="Duration (min)" />
              <Line yAxisId="right" type="monotone" dataKey="calories" stroke="#82ca9d" name="Calories" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Workouts</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calories</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intensity</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workouts.results.map((workout) => (
                <tr 
                  key={workout.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/workouts/${workout.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(workout.date_logged), 'PP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {workout.workout_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {workout.duration} min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {workout.calories}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${workout.intensity === 'high' 
                        ? 'bg-red-100 text-red-800' 
                        : workout.intensity === 'moderate'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'}`}>
                      {workout.intensity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {workouts.results.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No workouts recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;