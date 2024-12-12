import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Edit2, Scale, RulerIcon, Calendar
} from 'lucide-react';
import Avatar from '../common/Avatar';

const ProfileHeader = ({ profile, isOwnProfile }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar and Basic Info */}
        <div className="flex flex-col items-center md:items-start">
          <Avatar
            src={profile.profile_image}
            text={profile.name || profile.username}
            size="xl"
          />
          <h1 className="text-2xl font-bold text-white mt-4">
            {profile.name || profile.username}
          </h1>
          <p className="text-gray-400">
            Member since {format(new Date(profile.created_at), 'MMMM yyyy')}
          </p>
        </div>

        {/* Profile Details */}
        <div className="flex-1 space-y-4">
          {/* Bio Section */}
          {profile.bio && (
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-300 whitespace-pre-wrap">{profile.bio}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {profile.weight && (
              <div className="flex items-center gap-2 text-gray-400">
                <Scale className="h-4 w-4" />
                <span>{profile.weight} kg</span>
              </div>
            )}
            {profile.height && (
              <div className="flex items-center gap-2 text-gray-400">
                <RulerIcon className="h-4 w-4" />
                <span>{profile.height} cm</span>
              </div>
            )}
            {profile.date_of_birth && (
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(profile.date_of_birth), 'PP')}</span>
              </div>
            )}
          </div>

          {/* Workout Stats */}
          <div className="flex gap-8 mt-6 pt-6 border-t border-gray-700">
            <div className="text-center">
              <div className="text-lg font-semibold text-white">
                {profile.workouts_count}
              </div>
              <div className="text-sm text-gray-400">Workouts</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {isOwnProfile && (
          <button
            onClick={() => navigate(`/profiles/${profile.id}/edit`)}
            className="p-2 text-gray-300 hover:text-white bg-gray-700 
              hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Edit2 className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;