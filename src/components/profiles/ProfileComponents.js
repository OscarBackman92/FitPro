import React from 'react';
import { format } from 'date-fns';
import { LineChart, XAxis, YAxis, CartesianGrid, Line, Tooltip, ResponsiveContainer } from 'recharts';

export const ProfileHeader = ({ profile, is_owner, id, navigate }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
    <div className="flex justify-between items-start">
      <div className="flex items-center space-x-6">
        <div className="relative">
          <img
            src={profile?.profile_image || '/default-avatar.png'}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-green-500"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{profile?.name || profile?.username}</h1>
          <p className="text-gray-600 mt-1">{profile?.bio}</p>
          <div className="mt-2 flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Joined {format(new Date(profile?.created_at), 'MMM yyyy')}
            </span>
          </div>
        </div>
      </div>
      {is_owner && (
        <button
          onClick={() => navigate(`api/profiles/${id}/edit`)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793z" />
          </svg>
          Edit Profile
        </button>
      )}
    </div>
  </div>
);

export const StatsGrid = ({ profile, stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
    <StatCard title="Height" value={`${profile?.height || '-'} cm`} />
    <StatCard title="Weight" value={`${profile?.weight || '-'} kg`} />
    <StatCard title="Workouts" value={stats?.total_workouts || 0} />
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg text-center">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-xl font-semibold text-gray-900">{value}</p>
  </div>
);

export const ActivityChart = ({ chartData }) => (
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
          <Line yAxisId="left" type="monotone" dataKey="duration" stroke="#8884d8" name="Duration (min)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const WorkoutsList = ({ workouts, navigate, is_owner }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-900">Recent Workouts</h2>
      {is_owner && (
        <button
          onClick={() => navigate('/workouts/create')}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
          Log Workout
        </button>
      )}
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Intensity
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {workouts.results.map((workout) => (
            <tr 
              key={workout.id}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
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
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${workout.intensity === 'high' 
                    ? 'bg-red-100 text-red-800' 
                    : workout.intensity === 'moderate'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'}`}
                >
                  {workout.intensity}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {workouts.results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No workouts recorded yet.</p>
          {is_owner && (
            <button
              onClick={() => navigate('/workouts/create')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
              Log Your First Workout
            </button>
          )}
        </div>
      )}
    </div>
  </div>
);