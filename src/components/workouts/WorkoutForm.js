import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';

const WorkoutForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const [workoutData, setWorkoutData] = useState({
    workout_type: '',
    duration: '',
    calories: '',
    intensity: 'moderate',
    notes: '',
    date_logged: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (id) {
      const fetchWorkout = async () => {
        try {
          const { data } = await axiosReq.get(`/workouts/workouts/${id}/`);
          const { workout_type, duration, calories, intensity, notes, date_logged } = data;
          setWorkoutData({ workout_type, duration, calories, intensity, notes, date_logged });
        } catch (err) {
          console.error('Error fetching workout:', err);
          navigate('/workouts');
        }
      };
      fetchWorkout();
    }
  }, [id, navigate]);

  const handleChange = (event) => {
    setWorkoutData({
      ...workoutData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData();

    Object.keys(workoutData).forEach(key => {
      formData.append(key, workoutData[key]);
    });

    try {
      if (id) {
        await axiosReq.put(`/workouts/workouts/${id}/`, formData);
      } else {
        await axiosReq.post('/workouts/workouts/', formData);
      }
      navigate('/workouts');
    } catch (err) {
      console.error('Error submitting workout:', err);
      setErrors(err.response?.data || {});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {id ? 'Edit Workout' : 'Log New Workout'}
        </h2>

        {/* Date Field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date_logged">
            Date
          </label>
          <input
            id="date_logged"
            type="date"
            name="date_logged"
            value={workoutData.date_logged}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors?.date_logged?.map((message, idx) => (
            <p key={idx} className="text-red-500 text-xs italic mt-1">{message}</p>
          ))}
        </div>

        {/* Workout Type Field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="workout_type">
            Workout Type
          </label>
          <select
            id="workout_type"
            name="workout_type"
            value={workoutData.workout_type}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select type</option>
            <option value="cardio">Cardio</option>
            <option value="strength">Strength Training</option>
            <option value="flexibility">Flexibility</option>
            <option value="sports">Sports</option>
            <option value="other">Other</option>
          </select>
          {errors?.workout_type?.map((message, idx) => (
            <p key={idx} className="text-red-500 text-xs italic mt-1">{message}</p>
          ))}
        </div>

        {/* Duration Field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
            Duration (minutes)
          </label>
          <input
            id="duration"
            type="number"
            name="duration"
            value={workoutData.duration}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors?.duration?.map((message, idx) => (
            <p key={idx} className="text-red-500 text-xs italic mt-1">{message}</p>
          ))}
        </div>

        {/* Calories Field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="calories">
            Calories Burned
          </label>
          <input
            id="calories"
            type="number"
            name="calories"
            value={workoutData.calories}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors?.calories?.map((message, idx) => (
            <p key={idx} className="text-red-500 text-xs italic mt-1">{message}</p>
          ))}
        </div>

        {/* Intensity Field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="intensity">
            Intensity
          </label>
          <select
            id="intensity"
            name="intensity"
            value={workoutData.intensity}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
          {errors?.intensity?.map((message, idx) => (
            <p key={idx} className="text-red-500 text-xs italic mt-1">{message}</p>
          ))}
        </div>

        {/* Notes Field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={workoutData.notes}
            onChange={handleChange}
            rows="3"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors?.notes?.map((message, idx) => (
            <p key={idx} className="text-red-500 text-xs italic mt-1">{message}</p>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Saving...' : (id ? 'Save Changes' : 'Create Workout')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutForm;