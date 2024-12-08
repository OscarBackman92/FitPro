import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useProfileData, useSetProfileData } from '../../contexts/ProfileDataContext';
import { format } from 'date-fns';
import { 
  DumbbellIcon, Activity, Award, PlusCircle,
  Clock, Edit2, UserPlus, UserMinus, Calendar,
  Scale, RulerIcon 
} from 'lucide-react';
import Avatar from '../common/Avatar';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const { profileData } = useProfileData();
  const { handleFollow, handleUnfollow, fetchProfileData } = useSetProfileData();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchProfileData(id);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile data');
      toast.error('Error loading profile');
    } finally {
      setLoading(false);
    }
  }, [id, fetchProfileData]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const handleFollowClick = async () => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }

    const profile = profileData.pageProfile.results[0];
    try {
      if (profile.following_id) {
        await handleUnfollow(profile);
      } else {
        await handleFollow(profile);
      }
    } catch (err) {
      toast.error('Failed to update follow status');
    }
  };

  if (loading) {
    return <LoadingSpinner centered fullScreen />;
  }

  if (error || !profileData.pageProfile.results[0]) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            {error || 'Profile not found'}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const profile = profileData.pageProfile.results[0];
  const isOwnProfile = currentUser?.profile?.id === parseInt(id);
  const stats = profileData.stats;
  const recentWorkouts = profileData.workouts.results;

  const StatCard = ({ icon: Icon, label, value }) => (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <Icon className="h-6 w-6 text-green-500 mb-2" />
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
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
                    onClick={handleFollowClick}
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
                    onClick={() => navigate(`/profiles/${currentUser.profile.id}/edit`)}
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
                    {stats.total_workouts}
                  </div>
                  <div className="text-sm text-gray-400">Workouts</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            icon={DumbbellIcon} 
            label="Total Workouts" 
            value={stats.total_workouts} 
          />
          <StatCard 
            icon={Activity} 
            label="This Week" 
            value={stats.workouts_this_week} 
          />
          <StatCard 
            icon={Award} 
            label="Current Streak" 
            value={`${stats.current_streak} days`} 
          />
          <StatCard 
            icon={Clock} 
            label="Total Minutes" 
            value={stats.total_duration} 
          />
        </div>

        {/* Recent Workouts */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Recent Workouts</h2>
            {isOwnProfile && (
              <button
                onClick={() => navigate('/workouts/create')}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 
                  text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <PlusCircle className="h-5 w-5" />
                Log Workout
              </button>
            )}
          </div>

          {recentWorkouts.length > 0 ? (
            <div className="space-y-4">
              {recentWorkouts.map(workout => (
                <div 
                  key={workout.id}
                  className="flex justify-between p-4 bg-gray-700/50 rounded-lg 
                    hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => navigate(`/workouts/${workout.id}`)}
                >
                  <div>
                    <h3 className="font-medium text-white">{workout.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 
                        rounded-full text-sm">
                        {workout.workout_type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-sm
                        ${workout.intensity === 'high'
                          ? 'bg-red-500/20 text-red-400'
                          : workout.intensity === 'moderate'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-green-500/20 text-green-400'
                        }`}>
                        {workout.intensity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-300">{workout.duration} mins</p>
                    <p className="text-sm text-gray-400">
                      {format(new Date(workout.date_logged), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <DumbbellIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No workouts logged yet</p>
              {isOwnProfile && (
                <button
                  onClick={() => navigate('/workouts/create')}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg 
                    hover:bg-green-600 transition-colors"
                >
                  Log Your First Workout
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;