import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { axiosReq } from '../../services/axiosDefaults';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { ProfileHeader, StatsGrid, ActivityChart, WorkoutsList } from './ProfileComponents';
import Goals from '../goals/Goals';

const ProfilePage = () => {
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [workouts, setWorkouts] = useState({ results: [] });
  const [activeTab, setActiveTab] = useState('overview');

  const is_owner = currentUser?.profile_id === parseInt(id, 10);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [{ data: profileData }, { data: statsData }, { data: workoutsData }] = await Promise.all([
          axiosReq.get(`api/profiles/${id}/`),
          axiosReq.get(`api/profiles/${id}/stats/`),
          axiosReq.get(`api/workouts/workouts/?user=${id}`)
        ]);
        setProfile(profileData);
        setStats(statsData);
        setWorkouts(workoutsData);
        setError(null);
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setHasLoaded(true);
      }
    };

    setHasLoaded(false);
    fetchProfileData();
  }, [id]);

  if (!hasLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-50 rounded-lg text-red-600">
        {error}
      </div>
    );
  }

  const chartData = workouts.results
    .slice(0, 7)
    .map(workout => ({
      date: format(new Date(workout.date_logged), 'MMM d'),
      duration: workout.duration,
    }))
    .reverse();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProfileHeader profile={profile} is_owner={is_owner} id={id} navigate={navigate} />
      
      {/* Tab Navigation */}
      <div className="mb-8 border-b">
        <nav className="flex space-x-8" aria-label="Profile sections">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('workouts')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'workouts'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Workouts
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'goals'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Goals
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          <StatsGrid profile={profile} stats={stats} />
          {profile?.fitness_goals && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Fitness Goals</h2>
              <p className="text-gray-600">{profile.fitness_goals}</p>
            </div>
          )}
          <ActivityChart chartData={chartData} />
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Workouts</h2>
              <button
                onClick={() => setActiveTab('workouts')}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
            <WorkoutsList 
              workouts={{...workouts, results: workouts.results.slice(0, 3)}} 
              navigate={navigate} 
              is_owner={is_owner} 
            />
          </div>
        </>
      )}

      {activeTab === 'workouts' && (
        <WorkoutsList workouts={workouts} navigate={navigate} is_owner={is_owner} />
      )}

      {activeTab === 'goals' && (
        <div className="max-w-4xl mx-auto">
          {is_owner ? (
            <Goals />
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Fitness Goals</h2>
              <p className="text-gray-600">{profile.fitness_goals}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;