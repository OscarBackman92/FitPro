import React from 'react';
import { DumbbellIcon, Calendar, Award, Activity } from 'lucide-react';

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      id: 'total',
      icon: <DumbbellIcon className="h-6 w-6 text-blue-500" />,
      label: 'Total Workouts',
      value: stats.total_workouts || 0,
      formatter: value => value.toString(),
    },
    {
      id: 'weekly',
      icon: <Calendar className="h-6 w-6 text-green-500" />,
      label: 'This Week',
      value: stats.workouts_this_week || 0,
      formatter: value => value.toString(),
    },
    {
      id: 'streak',
      icon: <Award className="h-6 w-6 text-yellow-500" />,
      label: 'Current Streak',
      value: stats.current_streak || 0,
      formatter: value => `${value} days`,
    },
    {
      id: 'duration',
      icon: <Activity className="h-6 w-6 text-purple-500" />,
      label: 'Total Minutes',
      value: stats.total_duration || 0,
      formatter: value => value.toString(),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
      {statCards.map((card) => (
        <div
          key={card.id}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
        >
          <div className="inline-flex p-3 rounded-lg bg-gray-700/50 mb-4">
            {card.icon}
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {card.formatter(card.value)}
          </p>
          <p className="text-sm text-gray-400">{card.label}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;