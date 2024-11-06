import React from "react";
import Container from "react-bootstrap/Container";
import { Route, Routes } from "react-router-dom";
import "./api/axiosDefaults";

// Components
import NavBar from "./components/NavBar";
import PrivateRoute from "./components/common/PrivateRoute";
import ProfileEditForm from "./components/profiles/ProfileEditForm";
import Dashboard from './components/dashboard/Dashboard';

// Auth
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";

// Workouts
import WorkoutForm from "./components/workouts/WorkoutForm";
import WorkoutList from "./components/workouts/WorkoutList";
import WorkoutDetail from "./components/workouts/WorkoutDetail";

// Profile
import ProfilePage from "./components/profiles/ProfilePage";

// Goals
import Goals from "./components/goals/Goals";

// Styles
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Routes>
          {/* Public Home Route */}
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

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
          <Route
            path="/goals"
            element={
              <PrivateRoute>
                <Goals />
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
          <Route
            path="*"
            element={
              <div className="text-center mt-4">
                <h1>404 - Page Not Found</h1>
                <p>Sorry, the page you are looking for does not exist.</p>
              </div>
            }
          />
        </Routes>
      </Container>
    </div>
  );
}

export default App;