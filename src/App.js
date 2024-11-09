import React, { Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import "./services/axiosDefaults";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import styles from "./App.module.css";

// Common Components
import { NavBar, PrivateRoute, NotFound } from "../src/components/common/CommonIndex";

// Lazy-loaded Pages
const Home = React.lazy(() => import("./pages/Home"));
const Goals = React.lazy(() => import("./components/goals/Goals"));

// Auth Components
const SignUpForm = React.lazy(() => import("./pages/auth/SignUpForm"));
const SignInForm = React.lazy(() => import("./pages/auth/SignInForm"));

// Profile Components
const ProfilePage = React.lazy(() => import("./components/profiles/ProfilePage"));
const ProfileEditForm = React.lazy(() => import("./components/profiles/ProfileEditForm"));

// Workout Components
const WorkoutForm = React.lazy(() => import("./components/workouts/WorkoutForm"));
const WorkoutList = React.lazy(() => import("./components/workouts/WorkoutList"));
const WorkoutDetail = React.lazy(() => import("./components/workouts/WorkoutDetail"));

// Dashboard
const Dashboard = React.lazy(() => import('./components/dashboard/Dashboard'));

function App() {
  const { currentUser } = useCurrentUser();

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Public Home Route */}
            <Route 
              path="/" 
              element={currentUser ? <Navigate to="/dashboard" /> : <Home />} 
            />
            
            {/* Dashboard Route */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Goals Route */}
            <Route
              path="/goals"
              element={
                <PrivateRoute>
                  <Goals />
                </PrivateRoute>
              }
            />

            {/* Auth Routes */}
            <Route path="/signin" element={<SignInForm />} />
            <Route path="/signup" element={<SignUpForm />} />

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

            {/* Profile Routes */}
            <Route path="/profiles/:id" element={<ProfilePage />} />
            <Route
              path="/profiles/:id/edit"
              element={
                <PrivateRoute>
                  <ProfileEditForm />
                </PrivateRoute>
              }
            />

            {/* Feed Routes */}
            <Route
              path="/feed"
              element={
                <PrivateRoute>
                  <WorkoutList filter="owner__followed__owner__profile" />
                </PrivateRoute>
              }
            />
            <Route
              path="/liked"
              element={
                <PrivateRoute>
                  <WorkoutList filter="likes__owner__profile" />
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
