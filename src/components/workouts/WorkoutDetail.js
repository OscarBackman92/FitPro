import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';

const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await axios.get(`/api/workouts/${id}/`);
        setWorkout(response.data);
      } catch (err) {
        setError('Failed to load workout details');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await axios.delete(`/api/workouts/${id}/`);
        navigate('/workouts');
      } catch (err) {
        setError('Failed to delete workout');
      }
    }
  };

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

  if (!workout) {
    return (
      <Alert>
        <AlertDescription>Workout not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold capitalize">
              {workout.workout_type} Workout
            </h1>
            <p className="text-gray-600">
              {format(new Date(workout.date_logged), 'PPP')}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/workouts/${id}/edit`)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 border rounded text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold">Duration</h3>
            <p>{workout.duration} minutes</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold">Calories Burned</h3>
            <p>{workout.calories} kcal</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold">Intensity</h3>
            <p className="capitalize">{workout.intensity}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold">Time of Day</h3>
            <p>{format(new Date(workout.created_at), 'p')}</p>
          </div>
        </div>

        {workout.notes && (
          <div className="pt-4">
            <h3 className="font-semibold mb-2">Notes</h3>
            <p className="bg-gray-50 p-4 rounded">{workout.notes}</p>
          </div>
        )}

        <div className="pt-4">
          <h3 className="font-semibold mb-2">Stats</h3>
          <div className="bg-gray-50 p-4 rounded">
            <p>Average duration for {workout.workout_type} workouts: {workout.avg_duration} minutes</p>
            <p>Average calories burned: {workout.avg_calories} kcal</p>
            <p>Total workouts this month: {workout.workouts_this_month}</p>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <button
            onClick={() => navigate('/workouts')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ← Back to Workouts
          </button>
          <button
            onClick={() => navigate('/workouts/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Log Another Workout
          </button>
        </div>
      </Card>
    </div>
  );
};

export default WorkoutDetail;