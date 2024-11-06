import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { 
  Dumbbell, 
  Target, 
  History,
  TrendingUp,
  Plus,
  Users,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const cards = [
    {
      title: "Track Workout",
      description: "Log your latest fitness activity",
      icon: <Plus className="h-6 w-6" />,
      action: () => navigate('/workouts/create'),
      color: 'bg-green-500'
    },
    {
      title: "My Workouts",
      description: "View your workout history",
      icon: <History className="h-6 w-6" />,
      action: () => navigate('/workouts'),
      color: 'bg-blue-500'
    },
    {
      title: "Goals",
      description: "Set and track your fitness goals",
      icon: <Target className="h-6 w-6" />,
      action: () => navigate('/goals'),
      color: 'bg-purple-500'
    },
    {
      title: "Community",
      description: "Connect with other fitness enthusiasts",
      icon: <Users className="h-6 w-6" />,
      action: () => navigate('/feed'),
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {getGreeting()}, {currentUser?.profile?.name || currentUser?.username}! 👋
        </h1>
        <p className="text-gray-500 mt-2">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <button
            key={index}
            onClick={card.action}
            className="relative p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group"
          >
            <div className={`${card.color} text-white rounded-full p-3 inline-flex mb-4 group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
            <p className="text-gray-500 text-sm">{card.description}</p>
          </button>
        ))}
      </div>

      {/* Recent Activity & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Workouts */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Workouts</h2>
            <button
              onClick={() => navigate('/workouts')}
              className="text-sm text-green-500 hover:text-green-600 font-medium"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/workouts/${index + 1}`)}
              >
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Dumbbell className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Morning Workout</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Today</span>
                    <span>•</span>
                    <span>45 minutes</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Quick Stats</h2>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          
          <div className="space-y-6">
            {[
              { label: 'Workouts This Week', value: '4' },
              { label: 'Active Goals', value: '3' },
              { label: 'Total Minutes', value: '180' },
              { label: 'Calories Burned', value: '1,200' }
            ].map((stat, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 text-sm">{stat.label}</span>
                  <span className="text-xl font-bold text-gray-900">{stat.value}</span>
                </div>
                {index < 3 && <div className="h-px bg-gray-100"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;