import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import workoutService from '../../services/workoutService';
import LoadingSpinner from '../common/LoadingSpinner';
import DashboardHeader from './DashboardHeader';
import DashboardStats from './DashboardStats';
import QuickActions from './QuickActions';
import RecentWorkouts from './RecentWorkouts';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const [dashboardData, setDashboardData] = useState({
    workouts: [],
    stats: {
      total_workouts: 0,
      workouts_this_week: 0,
      current_streak: 0,
      total_duration: 0,
      workout_types: [],
      monthly_stats: [],
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) {
        navigate('/signin');
        return;
      }

      try {
        const statsResponse = await workoutService.getStatistics();
        const workoutsResponse = await workoutService.listWorkouts();

        setDashboardData({
          stats: {
            total_workouts: statsResponse?.total_workouts || 0,
            workouts_this_week: statsResponse?.workouts_this_week || 0,
            current_streak: statsResponse?.current_streak || 0,
            total_duration: statsResponse?.total_duration || 0,
            workout_types: statsResponse?.workout_types || [],
            monthly_stats: statsResponse?.monthly_stats || [],
          },
          workouts: Array.isArray(workoutsResponse?.results) ? workoutsResponse.results : [],
        });
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/signin');
        } else {
          toast.error('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner color="green" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <DashboardHeader username={currentUser?.username} />
      <DashboardStats stats={dashboardData.stats} />
      <QuickActions />
      <RecentWorkouts workouts={dashboardData.workouts} />
    </div>
  );
};

export default Dashboard;