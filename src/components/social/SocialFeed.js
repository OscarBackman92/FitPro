import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { socialService } from '../../services/socialService';
import { SocialActions, Comments, FollowButton } from './SocialIndex';
import toast from 'react-hot-toast';

export const SocialFeed = () => {
  const { currentUser } = useCurrentUser();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (pageNum = 1) => {
    try {
      const response = await socialService.getFeed(pageNum);
      setPosts(prev => pageNum === 1 ? response.results : [...prev, ...response.results]);
      setHasMore(!!response.next);
    } catch (err) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const loadMore = () => {
    if (!hasMore || loading) return;
    setPage(prev => prev + 1);
    fetchPosts(page + 1);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.user.profile_image || '/default-avatar.png'}
                    alt={post.user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium cursor-pointer hover:text-green-600"
                       onClick={() => navigate(`/profiles/${post.user.id}`)}>
                      {post.user.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {post.user.id !== currentUser?.id && (
                  <FollowButton
                    userId={post.user.id}
                    isFollowing={post.user.is_following}
                    onFollowUpdate={() => {
                      setPosts(posts.map(p =>
                        p.id === post.id
                          ? { ...p, user: { ...p.user, is_following: !p.user.is_following } }
                          : p
                      ));
                    }}
                  />
                )}
              </div>
            </div>

            <div className="p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {post.workout_type}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {post.duration} mins
                </span>
                {post.intensity && (
                  <span className={`px-3 py-1 rounded-full text-sm
                    ${post.intensity === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : post.intensity === 'moderate'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'}`}
                  >
                    {post.intensity}
                  </span>
                )}
              </div>

              {post.notes && (
                <p className="text-gray-600 mb-4">{post.notes}</p>
              )}

              <SocialActions
                workout={post}
                onLikeUpdate={(response) => {
                  setPosts(posts.map(p =>
                    p.id === post.id
                      ? { ...p, has_liked: !p.has_liked, likes_count: p.has_liked ? p.likes_count - 1 : p.likes_count + 1 }
                      : p
                  ));
                }}
              />
            </div>

            <div className="border-t">
              <Comments workoutId={post.id} />
            </div>
          </div>
        ))}

        {hasMore && (
          <button
            onClick={loadMore}
            className="w-full py-2 text-green-600 hover:text-green-700"
          >
            Load more
          </button>
        )}
      </div>
    </div>
  );
};

export default SocialFeed;