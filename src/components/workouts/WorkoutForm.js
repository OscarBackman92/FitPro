import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { workoutService } from '../../services/workoutService';
import { Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_STATE = {
  workout_type: '',
  duration: '',
  intensity: 'moderate',
  notes: '',
  date_logged: new Date().toISOString().split('T')[0]
};

const WORKOUT_TYPES = [
  { value: 'cardio', label: 'Cardio' },
  { value: 'strength', label: 'Strength Training' },
  { value: 'flexibility', label: 'Flexibility' },
  { value: 'sports', label: 'Sports' },
  { value: 'other', label: 'Other' }
];

const INTENSITY_LEVELS = [
  { value: 'low', label: 'Low' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'high', label: 'High' }
];

const WorkoutForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const loadWorkout = useCallback(async () => {
    if (!id) return;
    try {
      const data = await workoutService.getWorkout(id);
      setFormData({
        workout_type: data.workout_type || '',
        duration: data.duration || '',
        intensity: data.intensity || 'moderate',
        notes: data.notes || '',
        date_logged: data.date_logged || INITIAL_STATE.date_logged
      });
    } catch (err) {
      toast.error('Failed to load workout');
      navigate('/workouts');
    }
  }, [id, navigate]);

  useEffect(() => {
    loadWorkout();
  }, [loadWorkout]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    // Quick validation
    if (!formData.workout_type) newErrors.workout_type = 'Required';
    if (!formData.duration) newErrors.duration = 'Required';
    else if (formData.duration <= 0) newErrors.duration = 'Must be greater than 0';
    if (!formData.date_logged) newErrors.date_logged = 'Required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await (id 
        ? workoutService.updateWorkout(id, formData)
        : workoutService.createWorkout(formData)
      );
      
      // Dispatch event for stats update
      window.dispatchEvent(new Event('workout-updated'));
      
      toast.success(`Workout ${id ? 'updated' : 'created'} successfully`);
      navigate('/workouts');
    } catch (err) {
      toast.error(err.message || 'Failed to save workout');
      setErrors(err.errors || {});
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormField = ({ label, name, type = 'text', options = null }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      {options ? (
        <select
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`w-full rounded-md p-2.5 bg-gray-700 text-white border-2
            ${errors[name] ? 'border-red-500' : 'border-gray-600'}
            focus:border-green-500 transition-colors`}
        >
          {type === 'workout_type' && <option value="">Select type</option>}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`w-full rounded-md p-2.5 bg-gray-700 text-white border-2
            ${errors[name] ? 'border-red-500' : 'border-gray-600'}
            focus:border-green-500 transition-colors`}
        />
      )}
      {errors[name] && (
        <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        {id ? 'Edit Workout' : 'New Workout'}
      </h2>

      <div className="space-y-4">
        <FormField 
          label="Workout Type" 
          name="workout_type" 
          type="workout_type"
          options={WORKOUT_TYPES} 
        />
        <FormField 
          label="Duration (minutes)" 
          name="duration" 
          type="number" 
        />
        <FormField 
          label="Intensity" 
          name="intensity" 
          options={INTENSITY_LEVELS} 
        />
        <FormField 
          label="Date" 
          name="date_logged" 
          type="date" 
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full rounded-md p-2.5 bg-gray-700 text-white border-2 border-gray-600
              focus:border-green-500 transition-colors"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/workouts')}
            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white 
              bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          >
            <X size={18} /> Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 text-white bg-green-500 
              hover:bg-green-600 rounded-md transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {isSubmitting ? 'Saving...' : (id ? 'Update' : 'Create')}
          </button>
        </div>
      </div>
    </form>
  );
};

export default WorkoutForm;