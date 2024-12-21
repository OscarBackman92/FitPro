import React from 'react';
import { DumbbellIcon, Heart, Shield, Users } from 'lucide-react';

const About = () => {
  // Define the features to be displayed on the About page
  const features = [
    {
      icon: DumbbellIcon,
      title: 'Track Your Workouts',
      description: 'Log and monitor your exercises, sets, reps, and weight with ease.'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Connect with like-minded fitness enthusiasts and share your achievements.'
    },
    {
      icon: Heart,
      title: 'Health Insights',
      description: 'Get detailed insights into your fitness progress and health metrics.'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is secure and private, shared only with whom you choose.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-4">About FitPro</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Your complete fitness tracking solution for achieving your health and wellness goals.
        </p>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              {/* Render the feature icon */}
              <feature.icon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Mission Section */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 mb-12 max-w-4xl mx-auto border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
        <p className="text-gray-400 mb-4">
          At FitPro, we're committed to helping you achieve your fitness goals through 
          intuitive tracking, meaningful insights, and community support. Whether you're 
          just starting your fitness journey or you're a seasoned athlete, we provide 
          the tools you need to succeed.
        </p>
      </div>

      {/* Get Started Section */}
      <div className="bg-green-50 rounded-lg p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Started Today</h2>
        <p className="text-gray-600 mb-6">
          Join thousands of users who are already achieving their fitness goals with FitPro.
        </p>
        <button 
          onClick={() => window.location.href = '/signup'}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
        >
          Create Free Account
        </button>
      </div>
    </div>
  );
};

export default About;
