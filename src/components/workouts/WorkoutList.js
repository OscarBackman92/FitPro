import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import workoutService from '../../services/workoutService'; // Import workoutService directly
import Asset from '../../components/Asset';
import { Alert } from 'react-bootstrap';

const WorkoutList = ({ filter = "" }) => {
  const [workouts, setWorkouts] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [workoutType, setWorkoutType] = useState('all');
  const [sortOrder, setSortOrder] = useState('-date_logged');
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await workoutService.getWorkouts({
          ...filter && { filter },
          ordering: sortOrder
        });
        setWorkouts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError('Failed to load workouts');
      } finally {
        setHasLoaded(true);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchWorkouts();
    }, 300);

    return () => clearTimeout(timer);
  }, [filter, sortOrder]);

  const handleDelete = async (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await workoutService.deleteWorkout(workoutId);
        setWorkouts(prevWorkouts => ({
          ...prevWorkouts,
          results: prevWorkouts.results.filter(workout => workout.id !== workoutId)
        }));
      } catch (err) {
        setError('Failed to delete workout');
      }
    }
  };

  if (error) {
    return (
      <div className="p-6 bg-white rounded shadow-md text-center max-w-lg mx-auto">
        <Alert variant="warning">{error}</Alert>
      </div>
    );
  }

  if (!hasLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Asset spinner />
      </div>
    );
  }

  const totalWorkouts = workouts.results.length;
  const totalDuration = workouts.results.reduce((sum, w) => sum + w.duration, 0);
  const totalCalories = workouts.results.reduce((sum, w) => sum + w.calories, 0);
  const avgDuration = Math.round(totalDuration / totalWorkouts) || 0;

  const chartData = workouts.results
    .slice(0, 7)
    .map(workout => ({
      date: new Date(workout.date_logged).toLocaleDateString(),
      duration: workout.duration,
      calories: workout.calories
    }))
    .reverse();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{filter ? 'Activity Feed' : 'Workouts'}</h2>
        <button
          onClick={() => navigate('/workouts/create')}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          <i className="fas fa-plus mr-2"></i> Log Workout
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { title: 'Total Workouts', value: totalWorkouts, icon: 'fas fa-dumbbell' },
          { title: 'Total Duration', value: `${totalDuration} mins`, icon: 'fas fa-clock' },
          { title: 'Average Duration', value: `${avgDuration} mins`, icon: 'fas fa-chart-line' },
          { title: 'Total Calories', value: totalCalories, icon: 'fas fa-fire' }
        ].map(({ title, value, icon }) => (
          <div key={title} className="p-4 bg-white rounded shadow text-center">
            <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
            <p className="text-xl font-bold text-gray-800 mt-2">{value}</p>
            <i className={`${icon} text-green-500 text-3xl mt-4`}></i>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white p-4 rounded shadow mb-8">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Activity Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
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
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Workout Type</label>
          <select
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
            className="border rounded p-2 text-gray-700"
          >
            <option value="all">All Types</option>
            <option value="cardio">Cardio</option>
            <option value="strength">Strength</option>
            <option value="flexibility">Flexibility</option>
            <option value="sports">Sports</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Sort By</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded p-2 text-gray-700"
          >
            <option value="-date_logged">Newest First</option>
            <option value="date_logged">Oldest First</option>
            <option value="-duration">Duration (High to Low)</option>
            <option value="duration">Duration (Low to High)</option>
            <option value="-calories">Calories (High to Low)</option>
            <option value="calories">Calories (Low to High)</option>
          </select>
        </div>
      </div>

      {/* Workout Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        <div className="flex justify-between items-center p-4">
          <h3 className="text-lg font-bold text-gray-800">Workout History</h3>
          <button
            onClick={() => setIsTableExpanded(!isTableExpanded)}
            className="text-gray-500 hover:text-gray-800"
          >
            <i className={`fas fa-chevron-${isTableExpanded ? 'up' : 'down'}`}></i>
          </button>
        </div>

        <div className={`${isTableExpanded ? 'max-h-full' : 'max-h-64 overflow-y-auto'}`}>
          {workouts.results.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Calories</th>
                  <th className="p-3">Intensity</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {workouts.results
                  .filter(workout => workoutType === 'all' || workout.workout_type === workoutType)
                  .map((workout) => (
                    <tr key={workout.id} className="border-t">
                      <td className="p-3">{new Date(workout.date_logged).toLocaleDateString()}</td>
                      <td className="p-3 capitalize">{workout.workout_type}</td>
                      <td className="p-3">{workout.duration} mins</td>
                      <td className="p-3">{workout.calories}</td>
                      <td className="p-3 capitalize">
                        <span className={`px-2 py-1 rounded ${workout.intensity === 'high' ? 'bg-red-100 text-red-600' : workout.intensity === 'moderate' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                          {workout.intensity}
                        </span>
                      </td>
                      <td className="p-3 space-x-2">
                        <button onClick={() => navigate(`/workouts/${workout.id}/edit`)} className="text-blue-600 hover:text-blue-800">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button onClick={() => handleDelete(workout.id)} className="text-red-600 hover:text-red-800">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center p-4">
              <p>No workouts recorded yet. Start logging your fitness journey!</p>
              <button
                onClick={() => navigate('/workouts/create')}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
              >
                <i className="fas fa-plus"></i> Log Your First Workout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutList;
