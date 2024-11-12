import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Target, Calendar, CheckCircle, Edit2, Trash2 } from 'lucide-react';
import { goalsService } from '../../services/goalsService';
import toast from 'react-hot-toast';

const GoalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const response = await goalsService.getGoal(id);
        setGoal(response);
      } catch (err) {
        toast.error('Failed to load goal details');
        navigate('/goals');
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [id, navigate]);

  const handleComplete = async () => {
    try {
      await goalsService.toggleGoalCompletion(id);
      setGoal(prev => ({ ...prev, completed: !prev.completed }));
      toast.success(goal.completed ? 'Goal marked as incomplete' : 'Goal marked as complete');
    } catch (err) {
      toast.error('Failed to update goal status');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalsService.deleteGoal(id);
        toast.success('Goal deleted successfully');
        navigate('/goals');
      } catch (err) {
        toast.error('Failed to delete goal');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{goal?.description}</h1>
                <p className="text-sm text-gray-500">{goal?.type}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/goals/${id}/edit`)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <Edit2 className="h-5 w-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-400 hover:text-red-600"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span>Deadline: {new Date(goal?.deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-gray-400" />
                <span>Target: {goal?.target}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Progress</p>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${goal?.progress || 0}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">{goal?.progress || 0}% Complete</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleComplete}
            className={`mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
              ${goal?.completed 
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                : 'bg-green-500 text-white hover:bg-green-600'} 
              transition-colors`}
          >
            <CheckCircle className="h-5 w-5" />
            {goal?.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalDetail;