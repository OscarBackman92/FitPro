import React from 'react';
import { Activity, Award, Calendar, DumbbellIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';

export const ProfileHeader = ({ profile, is_owner, id, navigate }) => (
  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
    <div className="flex flex-col md:flex-row items-start gap-6">
      <div className="relative">
        <img
          src={profile?.profile_image || '/default-avatar.png'}
          alt={profile?.name || 'Profile'}
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
        />
      </div>
      <div className="flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {profile?.name || profile?.username}
            </h1>
            <p className="text-gray-400 mt-1">{profile?.bio}</p>
            <div className="flex items-center gap-2 mt-2 text-gray-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                Joined {profile?.created_at ? format(new Date(profile.created_at), 'MMMM yyyy') : 'Recently'}
              </span>
            </div>
          </div>
          {is_owner && (
            <button
              onClick={() => navigate(`/profiles/${id}/edit`)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 
                transition-colors flex items-center gap-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793z" />
                <path d="M11.793 5.793L3 14.586V17h2.414l8.793-8.793-2.828-2.828z" />
              </svg>
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

export const StatsGrid = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard
      icon={DumbbellIcon}
      label="Total Workouts"
      value={stats?.total_workouts || 0}
      color="blue"
    />
    <StatCard
      icon={Activity}
      label="Current Streak"
      value={`${stats?.current_streak || 0} days`}
      color="green"
    />
    <StatCard
      icon={Award}
      label="Goals Completed"
      value={stats?.completed_goals || 0}
      color="purple"
    />
    <StatCard
      icon={Calendar}
      label="Progress Rate"
      value={`${stats?.progress_rate || 0}%`}
      color="orange"
    />
  </div>
);

export const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
    <div className="flex items-center gap-4">
      <div className={`p-3 bg-${color}-500/20 rounded-lg`}>
        <Icon className={`h-6 w-6 text-${color}-500`} />
      </div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  </div>
);

export const WorkoutsList = ({ workouts, navigate }) => (
  <div className="space-y-4">
    {workouts.map(workout => (
      <div
        key={workout.id}
        onClick={() => navigate(`/workouts/${workout.id}`)}
        className="bg-gray-800 p-4 rounded-lg border border-gray-700 cursor-pointer 
          hover:border-green-500/50 transition-all"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">{workout.workout_type}</h3>
            <p className="text-sm text-gray-400">
              {format(new Date(workout.date_logged), 'PPP')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">{workout.duration} minutes</span>
            <span 
              className={`px-3 py-1 rounded-full text-sm
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
        </div>
      </div>
    ))}
    {workouts.length === 0 && (
      <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
        <DumbbellIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No workouts recorded yet</p>
      </div>
    )}
  </div>
);

export const GoalsList = ({ goals }) => (
  <div className="space-y-4">
    {goals.map(goal => (
      <div 
        key={goal.id}
        className="bg-gray-800 p-4 rounded-lg border border-gray-700"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-white">{goal.description}</h3>
            <p className="text-sm text-gray-400">Target: {goal.target}</p>
          </div>
          <span 
            className={`px-3 py-1 rounded-full text-sm
              ${goal.completed 
                ? 'bg-green-500/20 text-green-500' 
                : 'bg-yellow-500/20 text-yellow-500'
              }`}
          >
            {goal.completed ? 'Completed' : 'In Progress'}
          </span>
        </div>
        {!goal.completed && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Progress</span>
              <span>{goal.progress}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full">
              <div 
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    ))}
    {goals.length === 0 && (
      <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
        <Award className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No goals set yet</p>
      </div>
    )}
  </div>
);

const ProfileComponents = {
  ProfileHeader,
  StatsGrid,
  StatCard,
  WorkoutsList,
  GoalsList
};

export default ProfileComponents;