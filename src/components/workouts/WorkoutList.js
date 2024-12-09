import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DumbbellIcon, PlusCircle } from 'lucide-react';
import workoutService from '../../services/workoutService';
import toast from 'react-hot-toast';

const WorkoutList = () => {
  const navigate = useNavigate();
  const [workoutsList, setWorkoutsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await workoutService.listWorkouts();
        setWorkoutsList(response || []);
      } catch (err) {
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
      setWorkoutsList((prevWorkouts) =>
        prevWorkouts.filter((workout) => workout.id !== id)
      );
      toast.success('Workout deleted successfully');
    } catch (err) {
      toast.error('Error deleting workout. Please try again.');
    }
  };

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
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-400">{error}</div>
          ) : workoutsList.length === 0 ? (
            <div className="text-center py-12">
              <DumbbellIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No workouts found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="p-4 text-left text-gray-300">Title</th>
                  <th className="p-4 text-left text-gray-300">Date</th>
                  <th className="p-4 text-left text-gray-300">Type</th>
                  <th className="p-4 text-left text-gray-300">Duration</th>
                  <th className="p-4 text-left text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {workoutsList.map((workout) => (
                  <tr key={workout.id} className="hover:bg-gray-700/50">
                    <td className="p-4 text-white font-medium">{workout.title}</td>
                    <td className="p-4 text-gray-300">{workout.date_logged}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                        {workout.workout_type}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">{workout.duration} mins</td>
                    <td className="p-4">
                      <div className="flex gap-2">
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutList;
