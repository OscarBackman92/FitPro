import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../contexts/CurrentUserContext';
import { 
  ChevronRight, 
  DumbbellIcon, 
  LineChart, 
  Users, 
  CheckCircle 
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();

  // Redirect to dashboard if user is already logged in
  React.useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const features = [
    {
      icon: <DumbbellIcon className="w-6 h-6" />,
      title: 'Track Your Workouts',
      description: 'Log and monitor your exercises, sets, reps, and weight with ease.'
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: 'Progress Analytics',
      description: 'Visualize your fitness journey with detailed charts and statistics.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community Support',
      description: 'Connect with like-minded fitness enthusiasts and share your achievements.'
    },
  ];

  const testimonials = [
    {
      name: 'Sarah K.',
      role: 'Fitness Enthusiast',
      content: 'This app has completely transformed my workout routine. The progress tracking is incredible!',
      image: '/api/placeholder/64/64'
    },
    {
      name: 'Mike R.',
      role: 'Personal Trainer',
      content: 'I recommend this app to all my clients. It\'s intuitive and has all the features you need.',
      image: '/api/placeholder/64/64'
    },
    {
      name: 'Lisa M.',
      role: 'Marathon Runner',
      content: 'The best fitness tracking app I\'ve used. The community features keep me motivated!',
      image: '/api/placeholder/64/64'
    }
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
            <div className="flex-1">
              <img 
                src="/public/images/dashboard.png" 
                alt="App Dashboard Preview" 
                className="rounded-lg shadow-2xl"
              />
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

      {/* App Preview Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Powerful Features at Your Fingertips
              </h2>
              <div className="space-y-6">
                {[
                  'Real-time workout tracking and logging',
                  'Detailed progress analytics and charts',
                  'Custom workout plan creation',
                  'Social sharing and community support',
                  'Mobile-friendly design for on-the-go access'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
            Loved by Fitness Enthusiasts
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Start Your Fitness Journey Today
          </h2>
          <p className="text-xl text-white mb-8">
            Join thousands of users who are already achieving their fitness goals.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-4 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started For Free
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
