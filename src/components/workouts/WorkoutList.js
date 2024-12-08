import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DumbbellIcon, PlusCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { format } from 'date-fns';
import { workoutService } from '../../services/workoutService';
import toast from 'react-hot-toast';

const WorkoutList = () => {
  const navigate = useNavigate();
  const { workouts } = useCurrentUser();
  const [filters, setFilters] = useState({ type: 'all', search: '' });
  const [workoutsList, setWorkoutsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await workoutService.getWorkouts();
        setWorkoutsList(response.results || []);
      } catch (err) {
        setError('Failed to fetch workouts');
        toast.error('Error fetching workouts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [workouts]);

  // Filtered Workouts
  const filteredWorkouts = useMemo(() => {
    return workoutsList.filter((workout) => {
      const matchesSearch = workout.title
        .toLowerCase()
        .includes(filters.search.toLowerCase());
      const matchesType =
        filters.type === 'all' || workout.workout_type === filters.type;
      return matchesSearch && matchesType;
    });
  }, [filters, workoutsList]);

  // Analytics data
  const chartData = useMemo(() => {
    const typeCounts = workoutsList.reduce((acc, workout) => {
      acc[workout.workout_type] = (acc[workout.workout_type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(typeCounts).map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count,
    }));
  }, [workoutsList]);

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
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3 space-y-6">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4">
              <input
                type="text"
                placeholder="Search workouts..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white flex-1"
              />
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, type: e.target.value }))
                }
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="all">All Types</option>
                <option value="cardio">Cardio</option>
                <option value="strength">Strength</option>
                <option value="flexibility">Flexibility</option>
                <option value="sports">Sports</option>
              </select>
              <button
                onClick={() => navigate('/workouts/create')}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <PlusCircle className="h-5 w-5" />
                Log Workout
              </button>
            </div>

            {/* Workouts Table */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              {loading ? (
                <div className="text-center py-12 text-gray-400">Loading...</div>
              ) : error ? (
                <div className="text-center py-12 text-red-400">{error}</div>
              ) : filteredWorkouts.length === 0 ? (
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
                      <th className="p-4 text-left text-gray-300">Intensity</th>
                      <th className="p-4 text-left text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredWorkouts.map((workout) => (
                      <tr
                        key={workout.id}
                        className="hover:bg-gray-700/50"
                      >
                        <td className="p-4 text-white font-medium">
                          {workout.title}
                        </td>
                        <td className="p-4 text-gray-300">
                          {format(
                            new Date(workout.date_logged),
                            'MMM d, yyyy'
                          )}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                            {workout.workout_type}
                          </span>
                        </td>
                        <td className="p-4 text-gray-300">
                          {workout.duration} mins
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              workout.intensity === 'high'
                                ? 'bg-red-500/20 text-red-400'
                                : workout.intensity === 'moderate'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-green-500/20 text-green-400'
                            }`}
                          >
                            {workout.intensity}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                navigate(`/workouts/${workout.id}/edit`)
                              }
                              className="text-sm px-2 py-1 text-blue-400 hover:text-blue-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteWorkout(workout.id)
                              }
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

          {/* Mini Graph */}
          <div className="md:w-1/3 bg-gray-800 rounded-lg p-4 h-48 flex-shrink-0">
            {chartData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -15,
                    bottom: 0,
                  }}
                >
                  <XAxis
                    dataKey="type"
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#F9FAFB',
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutList;
