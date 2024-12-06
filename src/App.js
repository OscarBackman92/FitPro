import React, { Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./services/axiosDefaults";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import styles from "./App.module.css";

// Common Components
import { NavBar, PrivateRoute, NotFound, Footer } from "../src/components/common/CommonIndex";

// Lazy-loaded Components
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const About = lazy(() => import("./pages/About"));
const SignUpForm = lazy(() => import("./pages/auth/SignUpForm"));
const SignInForm = lazy(() => import("./pages/auth/SignInForm"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const ProfilePage = lazy(() => import("./components/profiles/ProfilePage"));
const ProfileEditForm = lazy(() => import("./components/profiles/ProfileEditForm"));
const WorkoutForm = lazy(() => import("./components/workouts/WorkoutForm"));
const WorkoutList = lazy(() => import("./components/workouts/WorkoutList"));
const SocialFeed = lazy(() => import("./components/social/SocialFeed"));
const FollowList = lazy(() => import("./components/social/FollowList"));

const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
  </div>
);

function App() {
  const { currentUser = null } = useCurrentUser() || {};

  return (
    <div className={styles.App}>
      <NavBar />
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
            path="/workouts/:id/edit"
            element={
              <PrivateRoute>
                <WorkoutForm />
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
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}

export default App;