// src/components/social/Discover.js
import React from 'react';
import { Search, UserPlus } from 'lucide-react';

const Discover = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Discover People</h1>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 p-3 border rounded-lg"
          />
        </div>

        <div className="grid gap-4">
          {[1, 2, 3, 4].map((user) => (
            <div key={user} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div>
                  <p className="font-medium">User {user}</p>
                  <p className="text-sm text-gray-500">10 workouts</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-green-500 border border-green-500 rounded-lg hover:bg-green-50">
                <UserPlus className="h-4 w-4" />
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discover;