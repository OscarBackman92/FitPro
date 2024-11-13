import React, { useState, useEffect } from 'react';
import { socialService } from '../../services/socialService';
import { Users, Heart, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const SocialStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await socialService.getSocialStats();
        setStats(data);
      } catch (err) {
        toast.error('Failed to load social statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-6">Social Overview</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="bg-green-500/20 p-3 rounded-lg inline-flex mb-2">
            <Users className="h-6 w-6 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-white">{stats?.followers_count}</p>
          <p className="text-sm text-gray-400">Followers</p>
        </div>
        <div className="text-center">
          <div className="bg-blue-500/20 p-3 rounded-lg inline-flex mb-2">
            <Activity className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-white">{stats?.following_count}</p>
          <p className="text-sm text-gray-400">Following</p>
        </div>
        <div className="text-center">
          <div className="bg-purple-500/20 p-3 rounded-lg inline-flex mb-2">
            <Heart className="h-6 w-6 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-white">{stats?.posts_count}</p>
          <p className="text-sm text-gray-400">Posts</p>
        </div>
      </div>
    </div>
  );
};

export default SocialStats;