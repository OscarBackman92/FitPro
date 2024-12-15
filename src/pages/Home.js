import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../contexts/CurrentUserContext';
import { ChevronRight, DumbbellIcon, LineChart, Users } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const currentUserContext = useCurrentUser(); // Safely access the context
  const currentUser = currentUserContext?.currentUser || null;

  React.useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const features = [
    {
      icon: <DumbbellIcon className="w-6 h-6" />,
      title: 'Track Your Workouts',
      description: 'Log and monitor your exercises, sets, reps, and weight with ease.',
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: 'Progress Analytics',
      description: 'Visualize your fitness journey with detailed charts and statistics.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community Support',
      description: 'Connect with like-minded fitness enthusiasts and share your achievements.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Track Your Fitness Journey Like Never Before
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of users who are achieving their fitness goals with our comprehensive workout tracking platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  Get Started Free
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/signin')}
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600">
              Our platform provides all the tools you need to track, analyze, and improve your fitness journey.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
