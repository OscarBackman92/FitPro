import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { 
  Menu, 
  X, 
  DumbbellIcon, 
  UserCircle, 
  LogOut, 
  Users,
  LayoutDashboard,
  Target,
  LogIn,
  UserPlus,
  Home,
  PlusSquare,
  Bell
} from 'lucide-react';
import Avatar from './Avatar';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, setCurrentUser } = useCurrentUser();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      toast.success('Successfully signed out');
      navigate('/signin');
    } catch (err) {
      console.error('Error signing out:', err);
      toast.error('Failed to sign out');
    }
  };

  // Navigation items for authenticated users
  const authenticatedLinks = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, text: 'Dashboard' },
    { to: '/feed', icon: <Users size={20} />, text: 'Social Feed' },
  ];

  // Navigation items for unauthenticated users
  const unauthenticatedLinks = [
    { to: '/', icon: <Home size={20} />, text: 'Home' },
    { to: '/about', icon: <DumbbellIcon size={20} />, text: 'About' },
    { to: '/features', icon: <Target size={20} />, text: 'Features' },
  ];

  const navLinkClasses = ({ isActive }) => `
    flex items-center gap-2 px-4 py-2 rounded-lg transition-all
    ${isActive ? 
      'bg-green-500 text-white font-semibold' : 
      'text-gray-700 hover:bg-green-50 hover:text-green-600'
    }
  `;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink 
              to={currentUser ? '/dashboard' : '/'}
              className="flex items-center gap-2 text-green-600 font-bold text-xl hover:text-green-700 transition-colors"
            >
              <DumbbellIcon className="h-8 w-8" />
              <span>FitPro</span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {currentUser ? (
              <>
                {/* Main navigation links */}
                {authenticatedLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={navLinkClasses}
                  >
                    {link.icon}
                    <span>{link.text}</span>
                  </NavLink>
                ))}

                {/* Quick Actions */}
                <button
                  onClick={() => navigate('/workouts/create')}
                  className="flex items-center gap-2 px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <PlusSquare size={20} />
                  <span>Log Workout</span>
                </button>

                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-green-600 transition-colors">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile Menu */}
                <div className="relative ml-3 flex items-center gap-4">
                  <NavLink
                    to={`/profiles/${currentUser?.profile?.id}`}
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-green-600 transition-colors"
                  >
                    <Avatar
                      src={currentUser?.profile?.image}
                      text={currentUser?.username}
                      height={32}
                    />
                  </NavLink>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 rounded-lg transition-all"
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Public navigation links */}
                {unauthenticatedLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={navLinkClasses}
                  >
                    {link.icon}
                    <span>{link.text}</span>
                  </NavLink>
                ))}

                {/* Auth buttons */}
                <div className="flex items-center gap-4 ml-4">
                  <NavLink
                    to="/signin"
                    className="flex items-center gap-2 px-4 py-2 text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-colors font-semibold"
                  >
                    <LogIn size={20} />
                    <span>Sign In</span>
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    <UserPlus size={20} />
                    <span>Sign Up</span>
                  </NavLink>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
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
        } md:hidden fixed inset-0 z-50 bg-white transform transition-all duration-300 ease-in-out`}
      >
        <div className="pt-16 pb-6 px-4 space-y-1">
          {currentUser ? (
            <>
              {authenticatedLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={navLinkClasses}
                >
                  {link.icon}
                  <span>{link.text}</span>
                </NavLink>
              ))}

              <button
                onClick={() => {
                  navigate('/workouts/create');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 mt-4 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
              >
                <PlusSquare size={20} />
                <span>Log Workout</span>
              </button>

              <NavLink
                to={`/profiles/${currentUser?.profile?.id}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-green-600 mt-4"
              >
                <UserCircle size={20} />
                <span>Profile</span>
              </NavLink>

              <button
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all mt-4"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              {unauthenticatedLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={navLinkClasses}
                >
                  {link.icon}
                  <span>{link.text}</span>
                </NavLink>
              ))}

              <div className="space-y-2 pt-4">
                <NavLink
                  to="/signin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 w-full text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-colors font-semibold"
                >
                  <LogIn size={20} />
                  <span>Sign In</span>
                </NavLink>
                <NavLink
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 w-full bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  <UserPlus size={20} />
                  <span>Sign Up</span>
                </NavLink>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;