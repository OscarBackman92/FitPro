import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isValid, parseISO } from 'date-fns';
import { 
  Edit2, Scale, RulerIcon, Calendar, 
  Mail, MapPin, User, Cake 
} from 'lucide-react';
import Avatar from '../common/Avatar';

const StatBadge = ({ icon: Icon, label, value, onClick }) => {
  if (!value) return null;

  return (
    <div 
      className={`flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg 
        ${onClick ? 'hover:bg-gray-700/50 cursor-pointer' : ''} transition-colors`}
      onClick={onClick}
    >
      <div className="p-2 bg-gray-700 rounded-lg">
        <Icon className="h-4 w-4 text-green-500" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-white font-medium">{value}</span>
      </div>
    </div>
  );
};

const InfoBadge = ({ icon: Icon, text }) => {
  if (!text) return null;

  return (
    <div className="flex items-center gap-2 text-gray-400 bg-gray-700/20 px-3 py-1.5 rounded-lg">
      <Icon className="h-4 w-4" />
      <span className="text-sm">{text}</span>
    </div>
  );
};

const ProfileHeader = ({ profile, isOwnProfile }) => {
  const navigate = useNavigate();

  const formatDate = (dateString, formatString) => {
    if (!dateString) return null;
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, formatString) : 'Invalid date';
    } catch {
      return 'Invalid date';
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    try {
      const date = parseISO(birthDate);
      if (!isValid(date)) return null;
      
      const today = new Date();
      let age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
        age--;
      }
      
      return age;
    } catch {
      return null;
    }
  };

  const age = calculateAge(profile.date_of_birth);

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header Banner */}
      <div className="relative h-32 bg-gradient-to-r from-green-500/10 to-blue-500/10">
        {isOwnProfile && (
          <button
            onClick={() => navigate(`/profiles/${profile.id}/edit`)}
            className="absolute top-4 right-4 p-2.5 bg-gray-800/90 hover:bg-gray-700 
              text-gray-300 hover:text-white rounded-lg transition-all duration-200 
              hover:scale-105 backdrop-blur-sm flex items-center gap-2 
              border border-gray-700 group"
          >
            <Edit2 className="h-4 w-4 group-hover:text-green-500 transition-colors" />
            <span className="text-sm font-medium">Edit Profile</span>
          </button>
        )}
      </div>

      {/* Profile Content */}
      <div className="p-6 -mt-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col items-center md:items-start">
            <Avatar
              src={profile.profile_image}
              text={profile.name || profile.username}
              size="xl"
              className="ring-4 ring-gray-800 w-32 h-32 bg-gray-700"
            />
            <div className="mt-4 text-center md:text-left">
              <h1 className="text-2xl font-bold text-white">
                {profile.name || profile.username}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p className="text-gray-400 text-sm">
                  Member since {formatDate(profile.created_at, 'MMMM yyyy')}
                </p>
                {age && (
                  <span className="text-sm bg-gray-700/30 px-2 py-0.5 rounded text-gray-300">
                    {age} years old
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1 space-y-6">
            {/* Bio */}
            {profile.bio && (
              <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-700/50">
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatBadge 
                icon={Scale} 
                label="Weight" 
                value={profile.weight && `${profile.weight} kg`} 
              />
              <StatBadge 
                icon={RulerIcon} 
                label="Height" 
                value={profile.height && `${profile.height} cm`} 
              />
              <StatBadge 
                icon={Calendar} 
                label="Birth Date" 
                value={profile.date_of_birth && formatDate(profile.date_of_birth, 'PP')} 
              />
            </div>

            {/* Additional Info */}
            <div className="flex flex-wrap gap-3">
              <InfoBadge icon={Mail} text={profile.email} />
              <InfoBadge icon={MapPin} text={profile.location} />
              {profile.gender && (
                <InfoBadge 
                  icon={User} 
                  text={profile.gender === 'M' ? 'Male' : profile.gender === 'F' ? 'Female' : 'Other'} 
                />
              )}
              {age && <InfoBadge icon={Cake} text={`${age} years old`} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;