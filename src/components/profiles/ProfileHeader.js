import { format, isValid, parseISO } from 'date-fns';
import { Scale, RulerIcon, Calendar, Mail, MapPin, User, Cake, Edit2 } from 'lucide-react';
import Avatar from '../common/Avatar';

const StatBadge = ({ icon: Icon, label, value }) => {
  if (!value) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg transition-colors">
      <div className="p-2 bg-gray-800 rounded-lg">
        <Icon className="h-5 w-5 text-green-500" />
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
    <div className="flex items-center gap-2 text-gray-400 bg-gray-800 px-3 py-2 rounded-lg">
      <Icon className="h-4 w-4" />
      <span className="text-sm">{text}</span>
    </div>
  );
};

const ProfileHeader = ({ profile, isOwnProfile, onEdit }) => {
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

  const profileImageURL = profile.profile_image
    ? `${profile.profile_image}`
    : 'https://res.cloudinary.com/dufw4ursl/image/upload/v1734633670/default_profile_ylwpgw_yz6v1r.jpg';

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden relative">
      <div className="p-6 flex flex-col lg:flex-row gap-8">
        {/* Avatar and Basic Info */}
        <div className="flex flex-col items-center lg:items-start">
          <div className="relative">
            <Avatar
              src={profileImageURL}
              text={profile.name || profile.username}
              size="xl"
              className="ring-4 ring-gray-800 bg-gray-700 rounded-full w-32 h-32"
            />
            {isOwnProfile && (
              <button
                onClick={onEdit}
                className="absolute top-0 right-0 bg-gray-700 hover:bg-gray-600 text-white 
                  rounded-full p-2 shadow-lg transition-transform transform hover:scale-105"
              >
                <Edit2 className="h-5 w-5 text-green-500" />
              </button>
            )}
          </div>
          <div className="mt-4 text-center lg:text-left">
            <h1 className="text-2xl font-bold text-white">
              {profile.name || profile.username}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <p className="text-gray-400 text-sm">
                Member since {formatDate(profile.created_at, 'MMMM yyyy')}
              </p>
              {age && (
                <span className="text-sm bg-gray-700 px-2 py-1 rounded text-gray-300">
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
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <p className="text-gray-300">{profile.bio}</p>
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
          <div className="flex flex-wrap gap-4">
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
  );
};

export default ProfileHeader;
