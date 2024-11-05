import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';
import { apiService } from '../services/apiService';
import { Menu, X, Dumbbell, Activity, Users, UserCircle, LogOut, Home, PlusCircle, TrendingUp } from 'lucide-react';
import Avatar from './Avatar';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const navigate = useNavigate();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const handleCurrentUser = async () => {
      try {
        const userData = await apiService.getCurrentUser();
        setCurrentUser(userData);
      } catch (err) {
        console.log('Not logged in');
      } finally {
        setHasLoaded(true);
      }
    };
    handleCurrentUser();
  }, [setCurrentUser]);

  const handleSignOut = async () => {
    try {
      await apiService.logout();
      setCurrentUser(null);
      navigate('/signin');
    } catch (err) {
      console.log('Error signing out:', err);
    }
  };

  const navLinkClasses = (isActive) => `
    flex items-center gap-2 px-4 py-2 rounded-lg transition-all
    ${isActive ? 
      'bg-green-500 text-gray-900 font-semibold' : 
      'text-gray-100 hover:bg-green-500/20 hover:text-green-400'
    }
  `;

  const loggedInLinks = [
    { to: '/', icon: <Home size={20} />, text: 'Dashboard' },
    { to: '/workouts/create', icon: <PlusCircle size={20} />, text: 'Log Workout' },
    { to: '/feed', icon: <Activity size={20} />, text: 'Activity Feed' },
    { to: '/stats', icon: <TrendingUp size={20} />, text: 'Stats' },
  ];

  return (
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex-shrink-0">
            <NavLink 
              to="/"
              className="flex items-center gap-2 text-green-400 font-bold text-xl hover:text-green-300 transition-colors"
            >
              <Dumbbell className="h-8 w-8" />
              <span>FitTrack</span>
            </NavLink>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {currentUser ? (
              <>
                {/* Main navigation links */}
                {loggedInLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) => navLinkClasses(isActive)}
                  >
                    {link.icon}
                    <span>{link.text}</span>
                  </NavLink>
                ))}

                {/* Profile dropdown */}
                <div className="relative ml-3 flex items-center gap-4">
                  <NavLink
                    to={`/profiles/${currentUser?.profile_id}`}
                    className="flex items-center gap-2 px-3 py-2 text-gray-100 hover:text-green-400 transition-colors"
                  >
                    <Avatar
                      src={currentUser?.profile_image}
                      text={currentUser?.username}
                      height={32}
                    />
                  </NavLink>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 text-gray-100 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all"
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              hasLoaded && (
                <div className="flex items-center gap-4">
                  <NavLink
                    to="/signin"
                    className="px-4 py-2 text-green-400 border-2 border-green-400 rounded-lg hover:bg-green-400 hover:text-gray-900 transition-all font-semibold"
                  >
                    Sign In
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="px-4 py-2 bg-green-400 text-gray-900 rounded-lg hover:bg-green-500 transition-all font-semibold"
                  >
                    Sign Up
                  </NavLink>
                </div>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-100 hover:bg-gray-800 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`${
          isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        } md:hidden bg-gray-900 shadow-lg absolute top-16 left-0 right-0 transition-all transform duration-300 ease-in-out`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {currentUser ? (
            <>
              {loggedInLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => 
                    `block ${navLinkClasses(isActive)}`
                  }
                >
                  {link.icon}
                  <span>{link.text}</span>
                </NavLink>
              ))}

              <NavLink
                to={`/profiles/${currentUser?.profile_id}`}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => 
                  `block ${navLinkClasses(isActive)}`
                }
              >
                <UserCircle size={20} />
                <span>Profile</span>
              </NavLink>

              <button
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-gray-100 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            hasLoaded && (
              <div className="space-y-2 p-2">
                <NavLink
                  to="/signin"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-2 text-green-400 border-2 border-green-400 rounded-lg hover:bg-green-400 hover:text-gray-900 transition-all font-semibold"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-2 bg-green-400 text-gray-900 rounded-lg hover:bg-green-500 transition-all font-semibold"
                >
                  Sign Up
                </NavLink>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;