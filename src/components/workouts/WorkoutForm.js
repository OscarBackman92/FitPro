import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const WorkoutForm = ({ workout = null }) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [workoutData, setWorkoutData] = useState({
    workout_type: workout?.workout_type || '',
    duration: workout?.duration || '',
    calories: workout?.calories || '',
    notes: workout?.notes || '',
    intensity: workout?.intensity || 'moderate'
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkoutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (workout) {
        // Edit existing workout
        await axios.put(`/api/workouts/${workout.id}/`, workoutData);
      } else {
        // Create new workout
        await axios.post('/api/workouts/', workoutData);
      }
      navigate('/workouts');
    } catch (err) {
      setErrors(err.response?.data || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Workout Type
          </label>
          <select
            name="workout_type"
            value={workoutData.workout_type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select type</option>
            <option value="cardio">Cardio</option>
            <option value="strength">Strength Training</option>
            <option value="flexibility">Flexibility</option>
            <option value="sports">Sports</option>
            <option value="other">Other</option>
          </select>
          {errors.workout_type?.map((error, idx) => (
            <Alert variant="destructive" key={idx}>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            name="duration"
            value={workoutData.duration}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="1"
            max="1440"
          />
          {errors.duration?.map((error, idx) => (
            <Alert variant="destructive" key={idx}>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Calories Burned
          </label>
          <input
            type="number"
            name="calories"
            value={workoutData.calories}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="0"
          />
          {errors.calories?.map((error, idx) => (
            <Alert variant="destructive" key={idx}>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Intensity
          </label>
          <select
            name="intensity"
            value={workoutData.intensity}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
          {errors.intensity?.map((error, idx) => (
            <Alert variant="destructive" key={idx}>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={workoutData.notes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
          />
          {errors.notes?.map((error, idx) => (
            <Alert variant="destructive" key={idx}>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/workouts')}
            className="px-4 py-2 border rounded hover:bg-gray-100"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Saving...' : (workout ? 'Update Workout' : 'Log Workout')}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default WorkoutForm;