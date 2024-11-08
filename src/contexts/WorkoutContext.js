// src/contexts/WorkoutContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { workoutService } from '../services/workoutService';
import logger from '../services/loggerService';

const WorkoutContext = createContext(null);

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
  SET_PAGINATION: 'SET_PAGINATION',
  SET_WORKOUT_TYPES: 'SET_WORKOUT_TYPES'
};

const initialState = {
  workouts: [],
  loading: false,
  error: null,
  stats: null,
  filters: {
    workout_type: '',
    intensity: '',
    date_logged_after: '',
    date_logged_before: '',
    ordering: '-date_logged'
  },
  pagination: {
    page: 1,
    hasMore: true,
    total: 0
  },
  workoutTypes: []
};

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
        pagination: { ...state.pagination, page: 1 }
      };
    
    case ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload }
      };

    case ACTIONS.SET_WORKOUT_TYPES:
      return {
        ...state,
        workoutTypes: action.payload
      };
    
    default:
      return state;
  }
}

export function WorkoutProvider({ children }) {
  const [state, dispatch] = useReducer(workoutReducer, initialState);

  const fetchWorkouts = useCallback(async (options = {}) => {
    const { page = state.pagination.page, filters = state.filters } = options;
    
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await workoutService.getWorkouts({
        ...filters,
        page
      });
      
      dispatch({ type: ACTIONS.SET_WORKOUTS, payload: response.results });
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
  }, [state.filters, state.pagination.page]);

  const fetchWorkoutStats = useCallback(async () => {
    try {
      const stats = await workoutService.getWorkoutStatistics();
      dispatch({ type: ACTIONS.SET_STATS, payload: stats });
    } catch (error) {
      logger.error('Error fetching workout stats:', error);
    }
  }, []);

  const fetchWorkoutTypes = useCallback(async () => {
    try {
      const types = await workoutService.getWorkoutTypes();
      dispatch({ type: ACTIONS.SET_WORKOUT_TYPES, payload: types });
    } catch (error) {
      logger.error('Error fetching workout types:', error);
    }
  }, []);

  const contextValue = {
    ...state,
    dispatch,
    fetchWorkouts,
    fetchWorkoutStats,
    fetchWorkoutTypes,

    setFilters: (filters) => {
      dispatch({ type: ACTIONS.SET_FILTERS, payload: filters });
    },

    resetFilters: () => {
      dispatch({ type: ACTIONS.SET_FILTERS, payload: initialState.filters });
    },

    clearError: () => {
      dispatch({ type: ACTIONS.CLEAR_ERROR });
    }
  };

  return (
    <WorkoutContext.Provider value={contextValue}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}

export default WorkoutProvider;