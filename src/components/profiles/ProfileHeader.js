import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Edit2, Scale, RulerIcon, Calendar, Mail, MapPin } from 'lucide-react';
import Avatar from '../common/Avatar';

const StatBadge = ({ icon: Icon, label, value }) => {
  if (!value) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
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

const ProfileHeader = ({ profile, isOwnProfile }) => {
  const navigate = useNavigate();

  const formatDate = (date, formatString) => {
    try {
      return format(new Date(date), formatString);
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg">
      <div className="relative h-32 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-t-xl">
        {isOwnProfile && (
          <button
            onClick={() => navigate(`/profiles/${profile.id}/edit`)}
            className="absolute top-4 right-4 p-2.5 bg-gray-800/90 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm flex items-center gap-2 border border-gray-700"
          >
            <Edit2 className="h-4 w-4" />
            <span className="text-sm font-medium">Edit Profile</span>
          </button>
        )}
      </div>

      <div className="p-6 -mt-16">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center md:items-start">
            <Avatar
              src={profile.profile_image}
              text={profile.name || profile.username}
              size="xl"
              className="ring-4 ring-gray-800 w-32 h-32"
            />
            <div className="mt-4 text-center md:text-left">
              <h1 className="text-2xl font-bold text-white">
                {profile.name || profile.username}
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Member since {formatDate(profile.created_at, 'MMMM yyyy')}
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            {profile.bio && (
              <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-700/50">
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{profile.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatBadge icon={Scale} label="Weight" value={profile.weight && `${profile.weight} kg`} />
              <StatBadge icon={RulerIcon} label="Height" value={profile.height && `${profile.height} cm`} />
              <StatBadge icon={Calendar} label="Birth Date" value={profile.date_of_birth && formatDate(profile.date_of_birth, 'PP')} />
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              {profile.email && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>{profile.email}</span>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
