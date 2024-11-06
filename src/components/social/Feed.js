import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, AlertCircle } from 'lucide-react';
import { Post, CommentSection, UserSuggestions } from './';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import socialService from '../../services/socialService';
import { Alert } from '@/components/ui/alert';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef();
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  // Authentication check
  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);

  // Fetch initial feed and suggested users
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [feedData, usersData] = await Promise.all([
          socialService.getFeed(1),
          socialService.getSuggestedUsers()
        ]);
        setPosts(feedData.results);
        setSuggestedUsers(usersData.results);
        setHasMore(!!feedData.next);
        setError(null);
      } catch (err) {
        setError('Failed to load feed. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchInitialData();
    }
  }, [currentUser]);

  // Infinite scroll setup
  const lastPostElementRef = useCallback(node => {
    if (loading || !hasMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadingMore]);

  // Load more posts when page changes
  useEffect(() => {
    const loadMorePosts = async () => {
      if (page === 1) return;
      
      try {
        setLoadingMore(true);
        const feedData = await socialService.getFeed(page);
        setPosts(prevPosts => [...prevPosts, ...feedData.results]);
        setHasMore(!!feedData.next);
      } catch (err) {
        setError('Failed to load more posts. Please try again later.');
      } finally {
        setLoadingMore(false);
      }
    };

    if (page > 1) {
      loadMorePosts();
    }
  }, [page]);

  const handleLike = async (postId) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (post.hasLiked) {
        await socialService.unlikeWorkout(postId);
      } else {
        await socialService.likeWorkout(postId);
      }
      
      setPosts(posts.map(post =>
        post.id === postId
          ? { 
              ...post, 
              hasLiked: !post.hasLiked,
              likes_count: post.hasLiked ? post.likes_count - 1 : post.likes_count + 1
            }
          : post
      ));
    } catch (err) {
      setError('Failed to update like. Please try again.');
    }
  };

  const handleComment = async (postId) => {
    setSelectedPost(posts.find(post => post.id === postId));
  };

  const handleAddComment = async (postId, content) => {
    try {
      const newComment = await socialService.addComment(postId, content);
      setPosts(posts.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, newComment],
              comments_count: post.comments_count + 1
            }
          : post
      ));
    } catch (err) {
      setError('Failed to add comment. Please try again.');
    }
  };

  const handleFollow = async (userId) => {
    try {
      await socialService.followUser(userId);
      setSuggestedUsers(suggestedUsers.filter(user => user.id !== userId));
    } catch (err) {
      setError('Failed to follow user. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <p>{error}</p>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Activity Feed</h2>
            <button
              onClick={() => navigate('/workouts/create')}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Dumbbell className="h-5 w-5" />
              Share Workout
            </button>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-lg">
              <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Posts Yet</h3>
              <p className="text-gray-500 mb-4">Follow some users or share your own workout!</p>
            </div>
          ) : (
            <>
              {posts.map((post, index) => (
                <div 
                  key={post.id} 
                  ref={index === posts.length - 1 ? lastPostElementRef : null}
                >
                  <Post
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                  />
                  {selectedPost?.id === post.id && (
                    <CommentSection
                      comments={post.comments}
                      postId={post.id}
                      onAddComment={handleAddComment}
                    />
                  )}
                </div>
              ))}
              {loadingMore && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto"></div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1">
          <UserSuggestions
            users={suggestedUsers}
            onFollow={handleFollow}
          />
        </div>
      </div>
    </div>
  );
};

export default Feed;