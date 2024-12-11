// src/components/profiles/ProfileWorkouts.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { DumbbellIcon, PlusCircle } from 'lucide-react';

const ProfileWorkouts = ({ workouts, isOwnProfile }) => {
  const navigate = useNavigate();
  console.log('ProfileWorkouts: Rendering with workouts:', workouts);
  
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Recent Workouts</h2>
        {isOwnProfile && (
          <button
            onClick={() => navigate('/workouts/create')}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 
              text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            Log Workout
          </button>
        )}
      </div>

      {workouts.length > 0 ? (
        <div className="space-y-4">
          {workouts.map(workout => (
            <div 
              key={workout.id}
              className="flex justify-between p-4 bg-gray-700/50 rounded-lg 
                hover:bg-gray-700 transition-colors cursor-pointer"
              onClick={() => navigate(`/workouts/${workout.id}`)}
            >
              <div>
                <h3 className="font-medium text-white">{workout.title}</h3>
                <div className="flex gap-2 mt-1">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 
                    rounded-full text-sm">
                    {workout.workout_type}
                  </span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 
                    rounded-full text-sm">
                    {workout.intensity}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-300">{workout.duration} mins</p>
                <p className="text-sm text-gray-400">
                  {format(new Date(workout.date_logged), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <DumbbellIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No workouts logged yet</p>
          {isOwnProfile && (
            <button
              onClick={() => navigate('/workouts/create')}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg 
                hover:bg-green-600 transition-colors"
            >
              Log Your First Workout
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileWorkouts;