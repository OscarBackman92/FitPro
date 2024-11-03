import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { LineChart, XAxis, YAxis, CartesianGrid, Line, Tooltip } from 'recharts';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const WorkoutList = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get('/api/workouts/');
        setWorkouts(response.data.results);
        
        // Process data for chart
        const chartData = response.data.results
          .slice(0, 7)
          .reverse()
          .map(workout => ({
            date: format(new Date(workout.date_logged), 'MMM d'),
            duration: workout.duration,
            calories: workout.calories
          }));
        setChartData(chartData);
        
      } catch (err) {
        setError('Failed to load workouts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const handleDelete = async (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await axios.delete(`/api/workouts/${workoutId}/`);
        setWorkouts(workouts.filter(w => w.id !== workoutId));
      } catch (err) {
        setError('Failed to delete workout');
      }
    }
  };

  const filteredWorkouts = workouts.filter(workout => {
    if (filter === 'all') return true;
    return workout.workout_type === filter;
  });

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Workouts</h1>
        <button
          onClick={() => navigate('/workouts/create')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Log New Workout
        </button>
      </div>

      <div className="bg-white rounded-lg p-4 shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <LineChart width={600} height={300} data={chartData}>
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Tooltip />
          <Line yAxisId="left" type="monotone" dataKey="duration" stroke="#8884d8" name="Duration (min)" />
          <Line yAxisId="right" type="monotone" dataKey="calories" stroke="#82ca9d" name="Calories" />
        </LineChart>
      </div>

      <div className="space-y-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Types</option>
          <option value="cardio">Cardio</option>
          <option value="strength">Strength</option>
          <option value="flexibility">Flexibility</option>
          <option value="sports">Sports</option>
          <option value="other">Other</option>
        </select>

        {filteredWorkouts.map(workout => (
          <Card key={workout.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold capitalize">
                  {workout.workout_type} - {workout.intensity} Intensity
                </h3>
                <p className="text-sm text-gray-600">
                  {format(new Date(workout.date_logged), 'PPP')}
                </p>
                <p className="mt-2">
                  Duration: {workout.duration} minutes | Calories: {workout.calories}
                </p>
                {workout.notes && (
                  <p className="mt-2 text-gray-700">{workout.notes}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/workouts/${workout.id}/edit`)}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(workout.id)}
                  className="px-3 py-1 text-sm border rounded text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WorkoutList;