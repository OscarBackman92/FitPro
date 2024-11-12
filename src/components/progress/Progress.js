// src/components/progress/Progress.js
import React from 'react';
import { Activity, Award, Dumbbell, TrendingUp } from 'lucide-react';

const Progress = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Progress</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {[
          { title: 'Workouts', value: '12', icon: Dumbbell },
          { title: 'Active Days', value: '8', icon: Activity },
          { title: 'Current Streak', value: '5', icon: Award },
          { title: 'Monthly Goal', value: '75%', icon: TrendingUp },
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <stat.icon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Progress Chart</h2>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          <p className="text-gray-500">Chart will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default Progress;