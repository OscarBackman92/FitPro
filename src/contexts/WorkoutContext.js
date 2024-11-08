// src/contexts/WorkoutContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { workoutService } from '../services/workoutService';
import logger from '../services/loggerService';

const WorkoutContext = createContext(null);
const WorkoutDispatchContext = createContext(null);

// Action Types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_WORKOUTS: 'SET_WORKOUTS',
  ADD_WORKOUT: 'ADD_WORKOUT',
  UPDATE_WORKOUT: 'UPDATE_WORKOUT',
  DELETE_WORKOUT: 'DELETE_WORKOUT',
  SET_STATS: 'SET_STATS',
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_PAGINATION: 'SET_PAGINATION'
};

// Initial state
const initialState = {
  workouts: [],
  loading: false,
  error: null,
  stats: null,
  filters: {
    workout_type: '',
    intensity: '',
    date_from: '',
    date_to: '',
    ordering: '-date_logged'
  },
  pagination: {
    page: 1,
    hasMore: true,
    total: 0
  }
};

// Reducer
function workoutReducer(state, action) {
  logger.debug('Workout reducer:', { type: action.type, payload: action.payload });

  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    case ACTIONS.SET_WORKOUTS:
      return { 
        ...state, 
        workouts: action.payload,
        loading: false,
        error: null 
      };
    
    case ACTIONS.ADD_WORKOUT:
      return {
        ...state,
        workouts: [action.payload, ...state.workouts],
        loading: false,
        error: null
      };
    
    case ACTIONS.UPDATE_WORKOUT:
      return {
        ...state,
        workouts: state.workouts.map(workout =>
          workout.id === action.payload.id ? action.payload : workout
        ),
        loading: false,
        error: null
      };
    
    case ACTIONS.DELETE_WORKOUT:
      return {
        ...state,
        workouts: state.workouts.filter(workout => workout.id !== action.payload),
        loading: false,
        error: null
      };
    
    case ACTIONS.SET_STATS:
      return { ...state, stats: action.payload, loading: false };
    
    case ACTIONS.SET_FILTERS:
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 } // Reset pagination when filters change
      };
    
    case ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload }
      };
    
    default:
      return state;
  }
}

export function WorkoutProvider({ children }) {
  const [state, dispatch] = useReducer(workoutReducer, initialState);

  const fetchWorkouts = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const { filters, pagination } = state;
      const response = await workoutService.getWorkouts({
        ...filters,
        page: pagination.page
      });
      
      dispatch({ type: ACTIONS.SET_WORKOUTS, payload: response.results });
      dispatch({
        type: ACTIONS.SET_PAGINATION,
        payload: {
          hasMore: !!response.next,
          total: response.count
        }
      });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [state]);

  const contextValue = {
    ...state,
    fetchWorkouts,
    dispatch
  };

  return (
    <WorkoutContext.Provider value={contextValue}>
      <WorkoutDispatchContext.Provider value={dispatch}>
        {children}
      </WorkoutDispatchContext.Provider>
    </WorkoutContext.Provider>
  );
}

// Custom hooks for accessing context
export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}

export function useWorkoutDispatch() {
  const context = useContext(WorkoutDispatchContext);
  if (context === undefined) {
    throw new Error('useWorkoutDispatch must be used within a WorkoutProvider');
  }
  return context;
}

// Action creators
export const workoutActions = {
  setLoading: (loading) => ({
    type: ACTIONS.SET_LOADING,
    payload: loading
  }),

  setError: (error) => ({
    type: ACTIONS.SET_ERROR,
    payload: error
  }),

  clearError: () => ({
    type: ACTIONS.CLEAR_ERROR
  }),

  setWorkouts: (workouts) => ({
    type: ACTIONS.SET_WORKOUTS,
    payload: workouts
  }),

  addWorkout: (workout) => ({
    type: ACTIONS.ADD_WORKOUT,
    payload: workout
  }),

  updateWorkout: (workout) => ({
    type: ACTIONS.UPDATE_WORKOUT,
    payload: workout
  }),

  deleteWorkout: (workoutId) => ({
    type: ACTIONS.DELETE_WORKOUT,
    payload: workoutId
  }),

  setStats: (stats) => ({
    type: ACTIONS.SET_STATS,
    payload: stats
  }),

  setFilters: (filters) => ({
    type: ACTIONS.SET_FILTERS,
    payload: filters
  }),

  setPagination: (pagination) => ({
    type: ACTIONS.SET_PAGINATION,
    payload: pagination
  })
};

export default WorkoutProvider;