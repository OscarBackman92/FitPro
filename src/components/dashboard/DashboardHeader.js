import React from 'react';
import { format } from 'date-fns';

// DashboardHeader component that takes a username as a prop
const DashboardHeader = ({ username }) => {
  return (
    <div className="mb-8 text-center">
      {/* Display a welcome message with the username or 'User' if no username is provided */}
      <h1 className="text-3xl font-bold text-white">
        Welcome, {username || 'User'}!
      </h1>
      {/* Display the current date formatted as 'Day of the week, Month day, year' */}
      <p className="text-gray-400">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
    </div>
  );
};

// Export the DashboardHeader component as the default export
export default DashboardHeader;