import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { 
  Menu, X, DumbbellIcon, LogOut, Users,
  LayoutDashboard, LogIn, UserPlus, 
  Home, PlusSquare, HelpCircle
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

  const navLinkClasses = ({ isActive }) => `
    flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
    ${isActive 
      ? 'bg-green-500 text-white font-semibold' 
      : 'text-gray-400 hover:text-white hover:bg-gray-800'
    }
  `;

  const mobileNavLinkClasses = ({ isActive }) => `
    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full
    ${isActive 
      ? 'bg-green-500 text-white font-semibold' 
      : 'text-gray-400 hover:text-white hover:bg-gray-800'
    }
  `;

  const mainNavLinks = currentUser ? [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/feed', icon: Users, label: 'Community' },
  ] : [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/about', icon: HelpCircle, label: 'About' },
  ];

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink 
            to={currentUser ? '/dashboard' : '/'}
            className="flex items-center gap-2 text-green-500 font-bold text-xl hover:text-green-400 transition-colors"
          >
            <DumbbellIcon className="h-8 w-8" />
            <span className="tracking-tight">FitPro</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {currentUser ? (
              <>
                {/* Main Navigation Links */}
                <div className="flex items-center gap-2">
                  {mainNavLinks.map((link) => (
                    <NavLink key={link.to} to={link.to} className={navLinkClasses}>
                      <link.icon size={20} />
                      <span>{link.label}</span>
                    </NavLink>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-800">
                  {/* User Menu */}
                  <div className="flex items-center gap-4">
                    <NavLink
                      to={`/profiles/${currentUser?.profile?.id}`}
                      className="flex items-center gap-2 hover:text-white transition-colors"
                    >
                      <Avatar
                        src={currentUser?.profile?.image}
                        text={currentUser?.username}
                        height={32}
                      />
                    </NavLink>

                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-2 text-gray-400 
                        hover:text-red-500 rounded-lg transition-colors"
                    >
                      <LogOut size={20} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Public Navigation */}
                <div className="flex items-center gap-2">
                  {mainNavLinks.map((link) => (
                    <NavLink key={link.to} to={link.to} className={navLinkClasses}>
                      <link.icon size={20} />
                      <span>{link.label}</span>
                    </NavLink>
                  ))}
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-800">
                  <NavLink
                    to="/signin"
                    className="flex items-center gap-2 px-4 py-2 text-green-500 border border-green-500 
                      rounded-lg hover:bg-green-500 hover:text-white transition-all duration-200"
                  >
                    <LogIn size={20} />
                    <span>Sign In</span>
                  </NavLink>

                  <NavLink
                    to="/signup"
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white 
                      rounded-lg hover:bg-green-600 transition-all duration-200 hover:shadow-lg 
                      hover:shadow-green-500/20"
                  >
                    <UserPlus size={20} />
                    <span>Sign Up</span>
                  </NavLink>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white 
              hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
        
        <div className="relative w-4/5 max-w-sm h-full bg-gray-900 text-white p-6 overflow-y-auto">
          {currentUser ? (
            <>
              {/* User Profile Section */}
              <div className="flex items-center gap-4 pb-6 mb-6 border-b border-gray-800">
                <Avatar
                  src={currentUser?.profile?.image}
                  text={currentUser?.username}
                  height={40}
                />
                <div>
                  <h3 className="font-semibold text-white">{currentUser?.username}</h3>
                  <p className="text-sm text-gray-400">View Profile</p>
                </div>
              </div>

              {/* Quick Actions */}
              <button
                onClick={() => {
                  navigate('/workouts/create');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-3 mb-6 bg-green-500 text-white 
                  rounded-lg hover:bg-green-600 transition-colors"
              >
                <PlusSquare size={20} />
                <span>Log Workout</span>
              </button>

              {/* Navigation Links */}
              <div className="space-y-2">
                {mainNavLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={mobileNavLinkClasses}
                    onClick={() => setIsOpen(false)}
                  >
                    <link.icon size={20} />
                    <span>{link.label}</span>
                  </NavLink>
                ))}
              </div>
              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-4 py-3 mt-6 text-red-500
                  hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              {/* Public Navigation */}
              <div className="space-y-2 mb-6">
                {mainNavLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={mobileNavLinkClasses}
                    onClick={() => setIsOpen(false)}
                  >
                    <link.icon size={20} />
                    <span>{link.label}</span>
                  </NavLink>
                ))}
              </div>

              {/* Auth Buttons */}
              <div className="space-y-3">
                <NavLink
                  to="/signin"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 
                    text-green-500 border border-green-500 rounded-lg 
                    hover:bg-green-500 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn size={20} />
                  <span>Sign In</span>
                </NavLink>

                <NavLink
                  to="/signup"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 
                    bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  onClick={() => setIsOpen(false)}
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