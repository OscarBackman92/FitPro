import React, { useState, useEffect } from 'react';
import { PlusCircle, CheckCircle2, Circle, Target, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { goalsService } from '../../services/goalsService';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    target: '',
    deadline: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await goalsService.getActiveGoals();
      setGoals(response.results || []);
    } catch (err) {
      setError('Failed to load goals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goalTypes = [
    { value: 'weight', label: 'Weight Goal', icon: '⚖️' },
    { value: 'workout', label: 'Workout Frequency', icon: '🏋️' },
    { value: 'strength', label: 'Strength Goal', icon: '💪' },
    { value: 'cardio', label: 'Cardio Goal', icon: '🏃' },
    { value: 'custom', label: 'Custom Goal', icon: '🎯' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const created = await goalsService.createGoal({
        ...formData,
        completed: false
      });
      setShowForm(false);
      setFormData({
        type: '',
        description: '',
        target: '',
        deadline: format(new Date(), 'yyyy-MM-dd')
      });
      setGoals(prevGoals => [...prevGoals, created]); // Add new goal to list without refetching
    } catch (err) {
      setError('Failed to create goal. Please try again.');
    }
  };

  const handleToggleCompletion = async (goalId) => {
    try {
      setError(null);
      await goalsService.toggleGoalCompletion(goalId);
      setGoals(prevGoals =>
        prevGoals.map(goal =>
          goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
        )
      ); // Update goal completion status locally
    } catch (err) {
      setError('Failed to update goal status. Please try again.');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        setError(null);
        await goalsService.deleteGoal(goalId);
        setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId)); // Remove goal from list without refetching
      } catch (err) {
        setError('Failed to delete goal. Please try again.');
      }
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
        <button
          onClick={fetchGoals}
          className="text-green-500 hover:text-green-600 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Target className="h-6 w-6 text-green-500" />
          <h1 className="text-2xl font-bold text-gray-900">Fitness Goals</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          Add Goal
        </button>
      </div>

      {/* Goal Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select a type</option>
                {goalTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., Run 5km in under 30 minutes"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target
              </label>
              <input
                type="text"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., 30 minutes"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full p-2 border rounded-md"
                min={format(new Date(), 'yyyy-MM-dd')}
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Create Goal
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Goals List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-lg">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Goals Set Yet</h3>
          <p className="text-gray-500 mb-4">Start setting your fitness goals and track your progress!</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {goals.map(goal => (
            <div key={goal.id} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleCompletion(goal.id)}
                    className="text-green-500 hover:text-green-600"
                  >
                    {goal.completed ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}
                  </button>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {goalTypes.find(t => t.value === goal.type)?.icon} {goal.description}
                    </h3>
                    <p className="text-sm text-gray-500">Target: {goal.target}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="h-5 w-5" />
                    <span className="text-sm">
                      {format(new Date(goal.deadline), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Goals;
