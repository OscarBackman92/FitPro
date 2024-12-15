import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useCurrentUser, useSetCurrentUser } from '../../contexts/CurrentUserContext';
import { 
  Menu, X, DumbbellIcon, LogOut,
  LayoutDashboard, LogIn, UserPlus, 
  Home, HelpCircle,
  Users
} from 'lucide-react';
import Avatar from './Avatar';
import authService from '../../services/authService';
import toast from 'react-hot-toast';

const NavBar = () => {
  const currentUserContext = useCurrentUser();
  const currentUser = currentUserContext?.currentUser || null;
  const setCurrentUser = useSetCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
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
    { to: '/workouts', icon: DumbbellIcon, label: 'Workouts' },
    { to: '/feed', icon: Users, label: 'Social Feed' },
  ] : [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/about', icon: HelpCircle, label: 'About' },
  ];

  // Add body scroll lock when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink 
            to={currentUser ? '/dashboard' : '/'}
            className="flex items-center gap-2 text-green-500 font-bold text-xl hover:text-green-400 transition-colors z-50"
          >
            <DumbbellIcon className="h-8 w-8" />
            <span className="tracking-tight">FitPro</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {currentUser ? (
              <>
                <div className="flex items-center gap-2">
                  {mainNavLinks.map((link) => (
                    <NavLink key={link.to} to={link.to} className={navLinkClasses}>
                      <link.icon size={20} />
                      <span>{link.label}</span>
                    </NavLink>
                  ))}
                </div>

                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-800">
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
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  {mainNavLinks.map((link) => (
                    <NavLink key={link.to} to={link.to} className={navLinkClasses}>
                      <link.icon size={20} />
                      <span>{link.label}</span>
                    </NavLink>
                  ))}
                </div>

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
                      rounded-lg hover:bg-green-600 transition-all duration-200 hover:shadow-lg"
                  >
                    <UserPlus size={20} />
                    <span>Sign Up</span>
                  </NavLink>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white 
              hover:bg-gray-800 transition-colors relative z-50"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 z-40 md:hidden">
          <div className="flex flex-col min-h-screen pt-20 px-6">
            <div className="space-y-4">
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
              
              {!currentUser && (
                <div className="space-y-4 pt-4 border-t border-gray-800">
                  <NavLink
                    to="/signin"
                    className="flex items-center gap-2 px-4 py-3 text-green-500 border border-green-500 
                      rounded-lg hover:bg-green-500 hover:text-white transition-all duration-200 w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn size={20} />
                    <span>Sign In</span>
                  </NavLink>

                  <NavLink
                    to="/signup"
                    className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white 
                      rounded-lg hover:bg-green-600 transition-all duration-200 w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserPlus size={20} />
                    <span>Sign Up</span>
                  </NavLink>
                </div>
              )}
              
              {currentUser && (
                <div className="space-y-4 pt-4 border-t border-gray-800">
                  <NavLink
                    to={`/profiles/${currentUser?.profile?.id}`}
                    className="flex items-center gap-2 px-4 py-3 text-gray-400 
                      hover:text-white rounded-lg transition-colors w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    <Avatar
                      src={currentUser?.profile?.image}
                      text={currentUser?.username}
                      height={32}
                    />
                    <span>Profile</span>
                  </NavLink>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-3 text-red-500 
                      hover:bg-red-500/10 rounded-lg transition-colors w-full"
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;