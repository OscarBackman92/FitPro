import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Calendar } from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/workouts/create')}
        className="flex items-center justify-center gap-2 p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-full sm:w-auto"
      >
        <PlusCircle className="h-5 w-5" />
        Log Workout
      </button>
      <button
        onClick={() => navigate('/workouts')}
        className="flex items-center justify-center gap-2 p-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors w-full sm:w-auto"
      >
        <Calendar className="h-5 w-5" />
        View History
      </button>
    </div>
  );
};

export default QuickActions;