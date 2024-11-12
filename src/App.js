import React, { Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import "./services/axiosDefaults";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import styles from "./App.module.css";

// Common Components
import { NavBar, PrivateRoute, NotFound } from "../src/components/common/CommonIndex";

// Lazy-loaded Components
// Main Pages
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const About = lazy(() => import("./pages/About"));

// Auth Components
const SignUpForm = lazy(() => import("./pages/auth/SignUpForm"));
const SignInForm = lazy(() => import("./pages/auth/SignInForm"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));

// Profile Components
const ProfilePage = lazy(() => import("./components/profiles/ProfilePage"));
const ProfileEditForm = lazy(() => import("./components/profiles/ProfileEditForm"));
const ProfileSettings = lazy(() => import("./components/profiles/ProfileSettings"));

// Workout Components
const WorkoutForm = lazy(() => import("./components/workouts/WorkoutForm"));
const WorkoutList = lazy(() => import("./components/workouts/WorkoutList"));
const WorkoutDetail = lazy(() => import("./components/workouts/WorkoutDetail"));
const WorkoutStats = lazy(() => import("./components/workouts/WorkoutStats"));

// Goals Components
const Goals = lazy(() => import("./components/goals/Goals"));
const GoalDetail = lazy(() => import("./components/goals/GoalDetail"));
const GoalForm = lazy(() => import("./components/goals/GoalForm"));

// Social Components
const SocialFeed = lazy(() => import("./components/social/SocialFeed"));
const FollowList = lazy(() => import("./components/social/FollowList"));
const Discover = lazy(() => import("./components/social/Discover"));

// Progress & Stats
const Progress = lazy(() => import("./components/progress/Progress"));
const Statistics = lazy(() => import("./components/statistics/Statistics"));

// Fallback UI for Suspense
const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
  </div>
);

function App() {
  const { currentUser } = useCurrentUser();

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={currentUser ? <Navigate to="/dashboard" /> : <Home />} 
            />
            <Route path="/about" element={<About />} />
            
            {/* Auth Routes */}
            <Route path="/signin" element={<SignInForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Workout Routes */}
            <Route
              path="/workouts"
              element={
                <PrivateRoute>
                  <WorkoutList />
                </PrivateRoute>
              }
            />
            <Route
              path="/workouts/create"
              element={
                <PrivateRoute>
                  <WorkoutForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/workouts/:id"
              element={
                <PrivateRoute>
                  <WorkoutDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/workouts/:id/edit"
              element={
                <PrivateRoute>
                  <WorkoutForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/workouts/stats"
              element={
                <PrivateRoute>
                  <WorkoutStats />
                </PrivateRoute>
              }
            />

            {/* Goals Routes */}
            <Route
              path="/goals"
              element={
                <PrivateRoute>
                  <Goals />
                </PrivateRoute>
              }
            />
            <Route
              path="/goals/create"
              element={
                <PrivateRoute>
                  <GoalForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/goals/:id"
              element={
                <PrivateRoute>
                  <GoalDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/goals/:id/edit"
              element={
                <PrivateRoute>
                  <GoalForm />
                </PrivateRoute>
              }
            />

            {/* Profile Routes */}
            <Route
              path="/profiles/:id"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profiles/:id/edit"
              element={
                <PrivateRoute>
                  <ProfileEditForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/profiles/:id/settings"
              element={
                <PrivateRoute>
                  <ProfileSettings />
                </PrivateRoute>
              }
            />

            {/* Social Routes */}
            <Route
              path="/feed"
              element={
                <PrivateRoute>
                  <SocialFeed />
                </PrivateRoute>
              }
            />
            <Route
              path="/profiles/:id/followers"
              element={
                <PrivateRoute>
                  <FollowList type="followers" />
                </PrivateRoute>
              }
            />
            <Route
              path="/profiles/:id/following"
              element={
                <PrivateRoute>
                  <FollowList type="following" />
                </PrivateRoute>
              }
            />
            <Route
              path="/discover"
              element={
                <PrivateRoute>
                  <Discover />
                </PrivateRoute>
              }
            />

            {/* Progress & Stats Routes */}
            <Route
              path="/progress"
              element={
                <PrivateRoute>
                  <Progress />
                </PrivateRoute>
              }
            />
            <Route
              path="/stats"
              element={
                <PrivateRoute>
                  <Statistics />
                </PrivateRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Container>
    </div>
  );
}

export default App;