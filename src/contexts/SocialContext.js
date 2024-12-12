// src/contexts/SocialContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { socialService } from '../services/socialService';
import logger from '../services/loggerService';

const SocialContext = createContext(undefined);

const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_FEED: 'SET_FEED',
  UPDATE_FEED: 'UPDATE_FEED',
  SET_COMMENTS: 'SET_COMMENTS',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  TOGGLE_LIKE: 'TOGGLE_LIKE',
  SET_PAGINATION: 'SET_PAGINATION',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

const initialState = {
  feed: [],
  comments: {},
  likes: new Set(),
  loading: false,
  error: null,
  pagination: {
    page: 1,
    hasMore: true,
    total: 0
  }
};

function socialReducer(state, action) {
  logger.debug('Social reducer:', { type: action.type, payload: action.payload });

  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case ACTIONS.SET_FEED:
      return { 
        ...state, 
        feed: action.payload,
        loading: false,
        error: null 
      };

    case ACTIONS.UPDATE_FEED:
      return {
        ...state,
        feed: [...state.feed, ...action.payload],
        loading: false
      };

    case ACTIONS.SET_COMMENTS:
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.workoutId]: action.payload.comments
        }
      };

    case ACTIONS.ADD_COMMENT:
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.workoutId]: [
            action.payload.comment,
            ...(state.comments[action.payload.workoutId] || [])
          ]
        }
      };

    case ACTIONS.DELETE_COMMENT:
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.workoutId]: state.comments[action.payload.workoutId]
            .filter(comment => comment.id !== action.payload.commentId)
        }
      };

    case ACTIONS.TOGGLE_LIKE:
      const likes = new Set(state.likes);
      if (likes.has(action.payload)) {
        likes.delete(action.payload);
      } else {
        likes.add(action.payload);
      }
      return { ...state, likes };
    case ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload }
      };

    default:
      return state;
  }
}

export function SocialProvider({ children }) {
  const [state, dispatch] = useReducer(socialReducer, initialState);

  const fetchFeed = useCallback(async (page = 1) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await socialService.getFeed(page);
      if (page === 1) {
        dispatch({ type: ACTIONS.SET_FEED, payload: response.results });
      } else {
        dispatch({ type: ACTIONS.UPDATE_FEED, payload: response.results });
      }
      dispatch({
        type: ACTIONS.SET_PAGINATION,
        payload: {
          hasMore: !!response.next,
          total: response.count,
          page
        }
      });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  const contextValue = {
    ...state,
    dispatch,
    fetchFeed,
    
    // Helper methods
    async toggleLike(workoutId) {
      try {
        await socialService.toggleLike(workoutId);
        dispatch({ type: ACTIONS.TOGGLE_LIKE, payload: workoutId });
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      }
    },

    async addComment(workoutId, content) {
      try {
        const comment = await socialService.addComment(workoutId, content);
        dispatch({
          type: ACTIONS.ADD_COMMENT,
          payload: { workoutId, comment }
        });
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      }
    },

    async deleteComment(workoutId, commentId) {
      try {
        await socialService.deleteComment(commentId);
        dispatch({
          type: ACTIONS.DELETE_COMMENT,
          payload: { workoutId, commentId }
        });
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      }
    }
  };

  return (
    <SocialContext.Provider value={contextValue}>
      {children}
    </SocialContext.Provider>
  );
}

export function useSocial() {
  const context = useContext(SocialContext);
  if (context === undefined) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
}

export default SocialProvider;