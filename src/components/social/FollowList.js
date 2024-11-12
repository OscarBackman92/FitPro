import React from 'react';
import { toast } from 'react-hot-toast';
import { FollowButton } from './FollowButton';
import { socialService } from '../../services/socialService';



export const FollowList = ({ userId, type = 'followers' }) => {
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
  
    React.useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await socialService[type === 'followers' ? 'getFollowers' : 'getFollowing'](userId);
          setUsers(response.results);
        } catch (err) {
          toast.error(`Failed to load ${type}`);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUsers();
    }, [userId, type]);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
            <div className="flex items-center gap-3">
              <img
                src={user.profile_image || '/default-avatar.png'}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-gray-500">{user.name}</p>
              </div>
            </div>
            <FollowButton
              userId={user.id}
              isFollowing={user.is_following}
              onFollowUpdate={(response) => {
                setUsers(users.map(u => 
                  u.id === user.id 
                    ? { ...u, is_following: !u.is_following }
                    : u
                ));
              }}
            />
          </div>
        ))}
      </div>
    );
  };