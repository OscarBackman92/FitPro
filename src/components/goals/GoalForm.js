// src/components/goals/GoalForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target } from 'lucide-react';
import toast from 'react-hot-toast';

const GoalForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    target: '',
    deadline: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API call would go here
      // await goalsService.createGoal(formData);
      toast.success('Goal created successfully');
      navigate('/goals');
    } catch (err) {
      toast.error('Failed to create goal');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="h-6 w-6 text-green-500" />
          <h1 className="text-2xl font-bold">Create Goal</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Goal Type</option>
              <option value="weight">Weight Goal</option>
              <option value="workout">Workout Goal</option>
              <option value="cardio">Cardio Goal</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Goal Description"
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <input
              type="text"
              name="target"
              value={formData.target}
              onChange={handleChange}
              placeholder="Target (e.g., '5km' or '50kg')"
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/goals')}
              className="flex-1 p-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 p-2 text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;