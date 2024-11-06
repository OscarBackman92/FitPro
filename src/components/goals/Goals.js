import React, { useState, useEffect } from 'react';
import { PlusCircle, CheckCircle2, Circle, Trophy, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    target: '',
    deadline: ''
  });

  const [setError] = useState(null);

  const goalTypes = [
    { value: 'weight', label: 'Weight Goal', icon: '⚖️' },
    { value: 'workout', label: 'Workout Frequency', icon: '🏋️' },
    { value: 'strength', label: 'Strength Goal', icon: '💪' },
    { value: 'cardio', label: 'Cardio Goal', icon: '🏃' },
    { value: 'custom', label: 'Custom Goal', icon: '🎯' }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setGoals([
        {
          id: 1,
          type: 'weight',
          description: 'Lose 5kg',
          target: '75kg',
          deadline: '2024-12-31',
          progress: 60,
          completed: false
        },
        {
          id: 2,
          type: 'workout',
          description: 'Work out 3 times per week',
          target: '12 workouts per month',
          deadline: '2024-12-31',
          progress: 75,
          completed: false
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // API call would go here
      const newGoal = {
        id: goals.length + 1,
        ...formData,
        progress: 0,
        completed: false
      };
      setGoals([...goals, newGoal]);
      setShowForm(false);
      setFormData({ type: '', description: '', target: '', deadline: '' });
      setError(null); // Clear any previous errors
    } catch (err) {
      setError('Failed to create goal. Please try again.');
    }
  };

  const toggleGoalCompletion = (goalId) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, completed: !goal.completed }
        : goal
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-green-500" />
          <h2 className="text-2xl font-bold text-gray-900">Fitness Goals</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          Add Goal
        </button>
      </div>

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

      <div className="grid gap-4">
        {goals.map(goal => (
          <div key={goal.id} className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleGoalCompletion(goal.id)}
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
              </div>
            </div>

            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs font-semibold inline-block text-green-600">
                    {goal.progress}% Complete
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded bg-green-100">
                <div
                  style={{ width: `${goal.progress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Goals;