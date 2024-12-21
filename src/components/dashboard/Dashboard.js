// Import dependencies
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

// Dashboard component to display user's workout overview
const Dashboard = () => {
 const navigate = useNavigate();
 const { currentUser } = useCurrentUser();
 
 // State management for dashboard data
 const [dashboardData, setDashboardData] = useState({
   workouts: [],
   stats: {
     total_workouts: 0,
     workouts_this_week: 0,
     current_streak: 0,
     total_duration: 0,
     workout_types: [],
     intensity_distribution: [],
   },
 });
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 // Fetch dashboard data on component mount
 useEffect(() => {
   const fetchDashboardData = async () => {
     if (!currentUser) {
       navigate('/signin');
       return;
     }

     try {
       setError(null);
       const data = await workoutService.getDashboardData();
       setDashboardData(data);
     } catch (err) {
       console.error('Dashboard data fetch error:', err);
       setError('Failed to load dashboard data');
       
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

 // Loading state
 if (loading) {
   return (
     <div className="min-h-screen bg-gray-900 flex items-center justify-center">
       <LoadingSpinner color="green" />
     </div>
   );
 }

 // Error state
 if (error) {
   return (
     <div className="min-h-screen bg-gray-900 flex items-center justify-center">
       <div className="text-center text-white">
         <p className="text-xl mb-4">{error}</p>
         <button
           onClick={() => window.location.reload()}
           className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
         >
           Try Again
         </button>
       </div>
     </div>
   );
 }

 // Render dashboard
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