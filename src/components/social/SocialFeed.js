import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, AlertCircle } from 'lucide-react';
import Avatar from '../common/Avatar';

const SocialFeed = () => {
  const navigate = useNavigate();
  const [activeTab] = useState('all');

  // Placeholder data until backend is fixed
  const placeholderPosts = [
    {
      id: 1,
      user: {
        username: 'Demo User',
        profile_image: null
      },
      workout_type: 'Cardio',
      duration: 30,
      date: new Date().toISOString(),
      likes: 5,
      comments: 2
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Feed Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Social Feed</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/discover')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg 
              hover:bg-gray-700 transition-colors"
          >
            <Users className="h-5 w-5" />
            Find Friends
          </button>
        </div>
      </div>

      {/* Feed Tabs */}
      <div className="flex border-b border-gray-700 mb-6">
        {['all', 'following', 'my posts'].map((tab) => (
          <button
            key={tab}
            className={`px-6 py-3 text-sm font-medium capitalize ${
              activeTab === tab
                ? 'text-green-500 border-b-2 border-green-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Temporary Notice */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-yellow-500">
          <AlertCircle className="h-5 w-5" />
          <p>Social features are currently under maintenance.</p>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {placeholderPosts.map((post) => (
          <div 
            key={post.id}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={post.user.profile_image}
                  text={post.user.username}
                  height={40}
                />
                <div>
                  <h3 className="font-medium text-white">{post.user.username}</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-500 
                  rounded-full text-sm">
                  {post.workout_type}
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-500 
                  rounded-full text-sm">
                  {post.duration} mins
                </span>
              </div>
            </div>

            {/* Post Actions */}
            <div className="flex items-center gap-6 text-gray-400">
              <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                <span>👍</span>
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                <span>💬</span>
                <span>{post.comments}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialFeed;