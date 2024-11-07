// src/contexts/SocialContext.js
import React, { createContext, useContext, useReducer } from 'react';
import logger from '../services/loggerService';

const SocialContext = createContext();

const initialState = {
  feed: [],
  comments: {},
  likes: new Set(),
  follows: new Set(),
  loading: false,
  error: null
};

const socialReducer = (state, action) => {
  logger.debug('Social reducer:', { type: action.type, payload: action.payload });

  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_FEED':
      return { ...state, feed: action.payload, loading: false };
    case 'SET_COMMENTS':
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.workoutId]: action.payload.comments
        }
      };
    case 'ADD_COMMENT':
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
    case 'TOGGLE_LIKE':
      const likes = new Set(state.likes);
      if (likes.has(action.payload)) {
        likes.delete(action.payload);
      } else {
        likes.add(action.payload);
      }
      return { ...state, likes };
    case 'TOGGLE_FOLLOW':
      const follows = new Set(state.follows);
      if (follows.has(action.payload)) {
        follows.delete(action.payload);
      } else {
        follows.add(action.payload);
      }
      return { ...state, follows };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const SocialProvider = ({ children }) => {
  const [state, dispatch] = useReducer(socialReducer, initialState);

  return (
    <SocialContext.Provider value={{ state, dispatch }}>
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};