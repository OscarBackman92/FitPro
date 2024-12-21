import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DumbbellIcon, PlusCircle } from 'lucide-react';
import workoutService from '../../services/workoutService';
import toast from 'react-hot-toast';

/**
 * WorkoutList component fetches and displays a list of workouts.
 * 
 * This component handles the following functionalities:
 * - Fetches workouts from the workoutService and displays them in a table.
 * - Provides a loading spinner while fetching data.
 * - Displays an error message if fetching data fails.
 * - Allows users to delete a workout with a confirmation prompt.
 * - Provides a button to navigate to the workout creation page.
 * 
 * @component
 * @example
 * return (
 *   <WorkoutList />
 * )
 * 
 * @returns {JSX.Element} The rendered WorkoutList component.
 */
const WorkoutList = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await workoutService.listWorkouts();
        setWorkouts(response.results || []);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError('Failed to fetch workouts');
        toast.error('Error fetching workouts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const handleDeleteWorkout = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;
    try {
      await workoutService.deleteWorkout(id);
      setWorkouts((prevWorkouts) =>
        prevWorkouts.filter((workout) => workout.id !== id)
      );
      toast.success('Workout deleted successfully');
    } catch (err) {
      toast.error('Error deleting workout. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-white mb-4">{error}</h2>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => navigate('/workouts/create')}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <PlusCircle className="h-5 w-5" />
            Log Workout
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          {workouts.length === 0 ? (
            <div className="text-center py-12">
              <DumbbellIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No workouts found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-sm md:text-base">
                <thead className="bg-gray-900/50 hidden md:table-header-group">
                  <tr>
                    <th className="p-4 text-left text-gray-300">Title</th>
                    <th className="p-4 text-left text-gray-300">Date</th>
                    <th className="p-4 text-left text-gray-300">Type</th>
                    <th className="p-4 text-left text-gray-300">Duration</th>
                    <th className="p-4 text-left text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {workouts.map((workout) => (
                    <tr
                      key={workout.id}
                      className="hover:bg-gray-700/50 md:table-row flex flex-col md:flex-row md:items-center md:gap-0 md:py-0"
                    >
                      {/* Mobile-friendly stacked rows */}
                      <td className="p-4 text-white font-medium md:whitespace-nowrap flex md:table-cell">
                        <span className="md:hidden font-bold text-gray-300 mr-2">
                          Title:
                        </span>
                        {workout.title}
                      </td>
                      <td className="p-4 text-gray-300 md:whitespace-nowrap flex md:table-cell">
                        <span className="md:hidden font-bold text-gray-300 mr-2">
                          Date:
                        </span>
                        {workout.date_logged}
                      </td>
                      <td className="p-4 flex md:table-cell">
                        <span className="md:hidden font-bold text-gray-300 mr-2">
                          Type:
                        </span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm md:inline">
                          {workout.workout_type}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300 md:whitespace-nowrap flex md:table-cell">
                        <span className="md:hidden font-bold text-gray-300 mr-2">
                          Duration:
                        </span>
                        {workout.duration} mins
                      </td>
                      <td className="p-4 flex gap-2 md:table-cell md:justify-center">
                        <button
                          onClick={() => navigate(`/workouts/${workout.id}/edit`)}
                          className="text-sm px-2 py-1 text-blue-400 hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteWorkout(workout.id)}
                          className="text-sm px-2 py-1 text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutList;