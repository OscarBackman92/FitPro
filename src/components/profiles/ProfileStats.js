import React from 'react';
import { 
  DumbbellIcon, Activity, 
  Award, Clock 
} from 'lucide-react';

const ProfileStats = ({ stats }) => {
  
  const statCards = [
    {
      icon: DumbbellIcon,
      label: 'Total Workouts',
      value: stats.total_workouts
    },
    {
      icon: Activity,
      label: 'This Week',
      value: stats.workouts_this_week
    },
    {
      icon: Award,
      label: 'Current Streak',
      value: `${stats.current_streak} days`
    },
    {
      icon: Clock,
      label: 'Total Minutes',
      value: stats.total_workout_time
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="inline-flex p-3 rounded-lg bg-gray-700/50 mb-4">
            <stat.icon className="h-6 w-6 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {typeof stat.value === 'number' ? 
              stat.value.toLocaleString() : stat.value}
          </p>
          <p className="text-sm text-gray-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;