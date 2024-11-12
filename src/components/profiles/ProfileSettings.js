// src/components/profiles/ProfileSettings.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { Bell, Lock, Shield, User, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

const ProfileSettings = () => {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    profileVisibility: 'public',
    twoFactorAuth: false,
    allowFollowers: true,
    showActivity: true,
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  useEffect(() => {
    // Load user settings when component mounts
    const loadSettings = async () => {
      try {
        // Implement API call to get user settings
        // const response = await userService.getSettings();
        // setSettings(response.data);
      } catch (error) {
        toast.error('Failed to load settings');
      }
    };

    loadSettings();
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // Implement API call to save settings
      // await userService.updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      toast.success('Successfully logged out');
      navigate('/signin');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <button
          onClick={saveSettings}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-4 mb-6">
            <User className="h-6 w-6 text-gray-400" />
            <h2 className="text-xl font-semibold">Profile</h2>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => navigate(`/profiles/${currentUser?.profile?.id}/edit`)}
              className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between"
            >
              <span>Edit Profile Information</span>
              <User className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate('/change-password')}
              className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between"
            >
              <span>Change Password</span>
              <Lock className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-4 mb-6">
            <Bell className="h-6 w-6 text-gray-400" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                  peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full 
                  peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                  after:left-[2px] after:bg-white after:border-gray-300 after:border 
                  after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600">
                </div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-500">Receive mobile notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                  peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full 
                  peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                  after:left-[2px] after:bg-white after:border-gray-300 after:border 
                  after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600">
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-4 mb-6">
            <Shield className="h-6 w-6 text-gray-400" />
            <h2 className="text-xl font-semibold">Privacy</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Visibility
              </label>
              <select
                value={settings.profileVisibility}
                onChange={(e) => handleChange('profileVisibility', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              >
                <option value="public">Public</option>
                <option value="followers">Followers Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Allow Followers</p>
                <p className="text-sm text-gray-500">Let others follow your profile</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowFollowers}
                  onChange={(e) => handleChange('allowFollowers', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                  peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full 
                  peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                  after:left-[2px] after:bg-white after:border-gray-300 after:border 
                  after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600">
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Activity</p>
                <p className="text-sm text-gray-500">Display your workouts in feed</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showActivity}
                  onChange={(e) => handleChange('showActivity', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                  peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full 
                  peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                  after:left-[2px] after:bg-white after:border-gray-300 after:border 
                  after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600">
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-4 mb-6">
            <Lock className="h-6 w-6 text-gray-400" />
            <h2 className="text-xl font-semibold">Security</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add extra layer of security</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                  peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full 
                  peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                  after:left-[2px] after:bg-white after:border-gray-300 after:border 
                  after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600">
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6 text-red-600">Account Actions</h2>
          <div className="space-y-4">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 
                rounded-lg transition-colors flex items-center justify-between"
            >
              <span>Sign Out</span>
              <LogOut className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to deactivate your account? This cannot be undone.')) {
                  // Handle account deactivation
                }
              }}
              className="w-full text-left px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 
                rounded-lg transition-colors"
            >
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;