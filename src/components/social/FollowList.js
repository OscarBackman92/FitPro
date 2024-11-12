// src/components/social/components/FollowList.js
import React from 'react';
import { Users } from 'lucide-react';

const FollowList = ({ type = 'followers' }) => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="h-6 w-6 text-green-500" />
          <h1 className="text-2xl font-bold">
            {type === 'followers' ? 'Followers' : 'Following'}
          </h1>
        </div>

        {/* Placeholder list */}
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <p className="font-medium">User {item}</p>
                  <p className="text-sm text-gray-500">@user{item}</p>
                </div>
              </div>
              <button className="px-4 py-2 text-green-500 border border-green-500 rounded-lg hover:bg-green-50">
                {type === 'followers' ? 'Follow Back' : 'Unfollow'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowList;