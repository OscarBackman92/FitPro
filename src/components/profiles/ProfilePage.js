import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { profileService } from '../../services/profileService';
import { 
  Edit2, Shield, User, Lock, MapPin, 
  Mail, Clock, Activity, Award, DumbbellIcon 
} from 'lucide-react';
import Avatar from '../common/Avatar';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

// Reusable Card Component
const Card = ({ title, icon: Icon, children, className = '' }) => (
  <div className={`bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
    {title && (
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-gray-400" />}
          {title}
        </h2>
      </div>
    )}
    {children}
  </div>
);

// Stat Card Component
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="text-center p-4 bg-gray-700 rounded-lg">
    <div className="flex justify-center mb-2">
      <Icon className="h-6 w-6 text-green-500" />
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-sm text-gray-400">{label}</p>
  </div>
);

// Profile Header Component
const ProfileHeader = ({ profile, isOwnProfile, onEdit }) => (
  <div className="flex flex-col md:flex-row gap-6">
    <div className="flex flex-col items-center gap-4">
      <Avatar
        src={profile.profile_image}
        text={profile.username}
        size="xl"
        className="ring-4 ring-gray-700"
      />
      {isOwnProfile && (
        <button
          onClick={onEdit}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 
            bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <Edit2 className="h-4 w-4" />
          Edit Profile
        </button>
      )}
    </div>

    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-2xl font-bold text-white">
          {profile.name || profile.username}
        </h1>
        {profile.is_verified && <Shield className="h-5 w-5 text-blue-500" />}
      </div>
      <p className="text-gray-400 mb-4">@{profile.username}</p>
      
      {profile.bio && (
        <p className="text-gray-300 mb-6 whitespace-pre-line">{profile.bio}</p>
      )}

      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
        <MetaInfo icon={Clock} text={`Joined ${new Date(profile.created_at).toLocaleDateString()}`} />
        {profile.location && <MetaInfo icon={MapPin} text={profile.location} />}
        {profile.email && <MetaInfo icon={Mail} text={profile.email} />}
      </div>
    </div>
  </div>
);

// Meta Info Component
const MetaInfo = ({ icon: Icon, text }) => (
  <span className="flex items-center gap-1">
    <Icon className="h-4 w-4" />
    {text}
  </span>
);

// Stats Grid Component
const StatsGrid = ({ stats }) => {
  const statsData = [
    { icon: DumbbellIcon, label: 'Workouts', value: stats?.total_workouts || 0 },
    { icon: Award, label: 'Current Streak', value: `${stats?.current_streak || 0} days` },
    { icon: Activity, label: 'This Week', value: stats?.workouts_this_week || 0 },
    { icon: Clock, label: 'Total Time', value: `${stats?.total_duration || 0} mins` }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700">
      {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUser?.profile?.id === parseInt(id);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const [profileData, statsData] = await Promise.all([
          profileService.getProfile(id),
          profileService.getProfileStats(id)
        ]);
        setProfile(profileData);
        setStats(statsData);
      } catch (err) {
        toast.error('Failed to load profile');
        if (err.response?.status === 404) {
          navigate('/404');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id, navigate]);

  if (loading) return <LoadingSpinner centered />;

  if (!profile) {
    return (
      <div className="text-center py-12">
        <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-200">Profile Not Found</h2>
        <p className="text-gray-400 mt-2">
          This profile doesn't exist or you don't have permission to view it.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <ProfileHeader 
          profile={profile}
          isOwnProfile={isOwnProfile}
          onEdit={() => navigate(`/profiles/${id}/edit`)}
        />
        <StatsGrid stats={stats} />
      </Card>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <Card title="Personal Info" icon={Lock}>
          <dl className="space-y-4">
            {[
              { label: 'Height', value: profile.height ? `${profile.height} cm` : 'Not set' },
              { label: 'Weight', value: profile.weight ? `${profile.weight} kg` : 'Not set' },
              { label: 'Gender', value: profile.gender || 'Not set' },
              { label: 'Birthday', value: profile.date_of_birth ? 
                new Date(profile.date_of_birth).toLocaleDateString() : 'Not set' }
            ].map(item => (
              <div key={item.label} className="flex justify-between">
                <dt className="text-gray-400">{item.label}</dt>
                <dd className="text-white font-medium">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card title="Goals" icon={Award}>
          {profile.goals?.length > 0 ? (
            <div className="space-y-4">
              {profile.goals.map((goal, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-300">{goal.description}</span>
                  <span className="text-green-500">{goal.progress}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">No goals set yet</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;