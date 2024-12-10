import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Edit2, UserPlus, UserMinus, 
  Scale, RulerIcon, Calendar 
} from 'lucide-react';
import Avatar from '../common/Avatar';
import { useSetProfileData } from '../../contexts/ProfileDataContext';

const ProfileHeader = ({ profile, isOwnProfile }) => {
  const navigate = useNavigate();
  const { handleFollow, handleUnfollow } = useSetProfileData();

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center gap-6">
        <Avatar
          src={profile.image}
          text={profile.name || profile.owner}
          size="xl"
          showStatus
          status={profile.is_private ? 'busy' : 'online'}
        />
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {profile.name || profile.owner}
              </h1>
              <p className="text-gray-400">
                Member since {format(new Date(profile.created_at), 'MMMM yyyy')}
              </p>
            </div>
            
            {!isOwnProfile ? (
              <button
                onClick={() => profile.following_id ? 
                  handleUnfollow(profile) : handleFollow(profile)
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-lg 
                  ${profile.following_id 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-green-500 hover:bg-green-600'
                  } text-white transition-colors`}
              >
                {profile.following_id ? (
                  <>
                    <UserMinus className="h-5 w-5" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Follow
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => navigate(`/profiles/${profile.id}/edit`)}
                className="p-2 text-gray-300 hover:text-white bg-gray-700 
                  hover:bg-gray-600 rounded-lg transition-colors"
              >
                <Edit2 className="h-5 w-5" />
              </button>
            )}
          </div>

          {profile.bio && (
            <p className="mt-4 text-gray-300">{profile.bio}</p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-4">
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

          <div className="mt-6 flex gap-4 border-t border-gray-700 pt-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-white">
                {profile.followers_count}
              </div>
              <div className="text-sm text-gray-400">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white">
                {profile.following_count}
              </div>
              <div className="text-sm text-gray-400">Following</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white">
                {profile.workouts_count}
              </div>
              <div className="text-sm text-gray-400">Workouts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;