// src/App.js
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import "./services/axiosDefaults";
import { useCurrentUser } from "./contexts/CurrentUserContext";

// Common Components
import { NavBar, PrivateRoute, NotFound } from "../src/components/common/CommonIndex";

// Pages
import Home from "./pages/Home";

// Auth Components
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";

// Profile Components
import ProfilePage from "./components/profiles/ProfilePage";
import ProfileEditForm from "./components/profiles/ProfileEditForm";

// Workout Components
import WorkoutForm from "./components/workouts/WorkoutForm";
import WorkoutList from "./components/workouts/WorkoutList";
import WorkoutDetail from "./components/workouts/WorkoutDetail";

// Dashboard
import Dashboard from './components/dashboard/Dashboard';

// Styles
import styles from "./App.module.css";

function App() {
  const { currentUser } = useCurrentUser();

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
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
      </Container>
    </div>
  );
}

export default App;