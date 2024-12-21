import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { DumbbellIcon, PlusCircle } from 'lucide-react';

/**
 * RecentWorkouts component displays a list of recent workouts.
 * 
 * @param {Object} props - The component props.
 * @param {Array} props.workouts - An array of workout objects.
 * @param {Object} props.workouts[].id - The unique identifier for the workout.
 * @param {string} props.workouts[].title - The title of the workout.
 * @param {string} props.workouts[].date_logged - The date when the workout was logged.
 * @param {number} props.workouts[].duration - The duration of the workout in minutes.
 * @param {string} props.workouts[].intensity - The intensity level of the workout (e.g., 'high', 'moderate', 'low').
 * 
 * @returns {JSX.Element} The RecentWorkouts component.
 */
const RecentWorkouts = ({ workouts }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <DumbbellIcon className="h-5 w-5 text-green-500" />
            <h2 className="text-xl font-bold text-white">Recent Workouts</h2>
          </div>
        </div>

        {workouts.length > 0 ? (
          <div className="divide-y divide-gray-700">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                onClick={() => navigate(`/workouts/${workout.id}/edit`)}
                className="flex items-center py-4 cursor-pointer hover:bg-gray-700/50 transition-colors rounded-lg px-3 -mx-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        workout.intensity === 'high'
                          ? 'bg-red-500'
                          : workout.intensity === 'moderate'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                    />
                    <h3 className="text-white capitalize font-medium">
                      {workout.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {format(new Date(workout.date_logged), 'MMMM d, yyyy')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-white font-medium">
                    {workout.duration} mins
                  </span>
                  <p className="text-sm text-gray-400 capitalize">
                    {workout.intensity} intensity
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <DumbbellIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No workouts logged yet</p>
            <button
              onClick={() => navigate('/workouts/create')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <PlusCircle className="h-5 w-5" />
              Log Your First Workout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentWorkouts;