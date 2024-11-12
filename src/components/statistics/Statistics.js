// src/components/statistics/Statistics.js
import React from 'react';
import { BarChart2, PieChart, TrendingUp, Clock } from 'lucide-react';

const Statistics = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Statistics Overview</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <Clock className="h-6 w-6 text-green-500 mb-2" />
          <p className="text-2xl font-bold">24h</p>
          <p className="text-sm text-gray-500">Total Time</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <BarChart2 className="h-6 w-6 text-blue-500 mb-2" />
          <p className="text-2xl font-bold">15</p>
          <p className="text-sm text-gray-500">Workouts</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <TrendingUp className="h-6 w-6 text-purple-500 mb-2" />
          <p className="text-2xl font-bold">85%</p>
          <p className="text-sm text-gray-500">Goal Progress</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <PieChart className="h-6 w-6 text-orange-500 mb-2" />
          <p className="text-2xl font-bold">4.5</p>
          <p className="text-sm text-gray-500">Avg Workouts/Week</p>
        </div>
      </div>

      {/* Chart Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Activity Timeline</h2>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Timeline chart will be displayed here</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Workout Distribution</h2>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Distribution chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;