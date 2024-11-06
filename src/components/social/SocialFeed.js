import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';

const Feed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFeedItems([
        {
          id: 1,
          user: {
            id: 2,
            username: 'fitnessUser',
            profile_image: '/api/placeholder/40/40'
          },
          workout_type: 'cardio',
          duration: 45,
          calories: 400,
          likes: 12,
          comments: 3,
          created_at: '2024-03-15T10:30:00Z'
        },
        {
          id: 2,
          user: {
            id: 3,
            username: 'gymEnthusiast',
            profile_image: '/api/placeholder/40/40'
          },
          workout_type: 'strength',
          duration: 60,
          calories: 500,
          likes: 8,
          comments: 1,
          created_at: '2024-03-15T09:15:00Z'
        }
      ]);

      setSuggestedUsers([
        {
          id: 4,
          username: 'fitnessPro',
          profile_image: '/api/placeholder/40/40',
          followers: 1234
        },
        {
          id: 5,
          username: 'yogaMaster',
          profile_image: '/api/placeholder/40/40',
          followers: 856
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const handleFollow = (userId) => {
    setSuggestedUsers(suggestedUsers.filter(user => user.id !== userId));
  };

  const handleLike = (postId) => {
    setFeedItems(feedItems.map(item =>
      item.id === postId ? { ...item, likes: item.likes + 1 } : item
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Activity Feed</h2>
            <button
              onClick={() => navigate('/workouts/create')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Share Workout
            </button>
          </div>

          {feedItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.user.profile_image}
                    alt={item.user.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{item.user.username}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {item.workout_type}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{item.duration} mins</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{item.calories} calories</span>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t">
                <button
                  onClick={() => handleLike(item.id)}
                  className="flex items-center gap-2 text-gray-500 hover:text-red-500"
                >
                  <Heart className="h-5 w-5" />
                  <span>{item.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500">
                  <MessageCircle className="h-5 w-5" />
                  <span>{item.comments}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Users */}
        <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
          <h3 className="font-semibold text-gray-900 mb-4">Suggested Users</h3>
          <div className="space-y-4">
            {suggestedUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={user.profile_image}
                    alt={user.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.followers} followers</p>
                  </div>
                </div>
                <button
                  onClick={() => handleFollow(user.id)}
                  className="flex items-center gap-1 text-green-500 hover:text-green-600"
                >
                  <UserPlus className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;