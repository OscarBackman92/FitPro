import React from 'react';
import { format } from 'date-fns';

const DashboardHeader = ({ username }) => {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-white">
        Welcome, {username || 'User'}!
      </h1>
      <p className="text-gray-400">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
    </div>
  );
};

export default DashboardHeader;