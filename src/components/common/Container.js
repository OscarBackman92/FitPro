
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

const Container = ({ children, noPadding = false }) => {
  const location = useLocation();
  const { currentUser } = useCurrentUser();

  const isFullWidth = ['/feed', '/workouts', '/'].includes(location.pathname);

  const getBgColor = () => {
    if (location.pathname.startsWith('/auth')) return 'bg-white';
    if (!currentUser) return 'bg-gray-50';
    return 'bg-gray-50';
  };

  const getMaxWidth = () => {
    if (isFullWidth) return 'max-w-7xl';
    if (location.pathname.startsWith('/profiles')) return 'max-w-4xl';
    if (location.pathname.startsWith('/workouts')) return 'max-w-5xl';
    return 'max-w-7xl';
  };

  return (
    <main className={`min-h-screen ${getBgColor()}`}>
      <div
        className={`
          mx-auto
          ${getMaxWidth()}
          ${!noPadding && 'px-4 sm:px-6 lg:px-8'} 
          ${!isFullWidth && 'py-8'}
        `}
      >
        {/* Sidebar Layout */}
        {location.pathname === '/' && currentUser ? (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">{children}</div>

            {/* Sidebar */}
            <aside className="md:w-80 space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <QuickStat label="Total Workouts" value={currentUser.total_workouts || 0} />
                  <QuickStat label="This Week" value={currentUser.workouts_this_week || 0} />
                  <QuickStat label="Streak" value={`${currentUser.current_streak || 0} days`} />
                </div>
              </div>

              {/* Goals Progress */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Goals Progress</h3>
                <div className="space-y-4">
                  {currentUser.active_goals?.map(goal => (
                    <GoalProgress key={goal.id} goal={goal} />
                  ))}
                </div>
              </div>
            </aside>
          </div>
        ) : (
          children
        )}
      </div>

      {/* Footer */}
      {!location.pathname.startsWith('/auth') && (
        <footer className="bg-white border-t mt-auto py-8">
          <div className={`mx-auto ${getMaxWidth()} px-4 sm:px-6 lg:px-8`}>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-500 text-sm">
                © {new Date().getFullYear()} FitTrack. All rights reserved.
              </div>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <FooterLink href="/about">About</FooterLink>
                <FooterLink href="/privacy">Privacy</FooterLink>
                <FooterLink href="/terms">Terms</FooterLink>
                <FooterLink href="/contact">Contact</FooterLink>
              </div>
            </div>
          </div>
        </footer>
      )}
    </main>
  );
};

// Helper Components
const QuickStat = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold text-gray-900">{value}</span>
  </div>
);

const GoalProgress = ({ goal }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{goal.description}</span>
      <span className="text-sm font-medium text-gray-900">{goal.progress}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-green-500 h-2 rounded-full"
        style={{ width: `${goal.progress}%` }}
      />
    </div>
  </div>
);

const FooterLink = ({ href, children }) => (
  <a
    href={href}
    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
  >
    {children}
  </a>
);

export default Container;