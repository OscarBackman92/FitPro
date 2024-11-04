import React from "react";
import Container from "react-bootstrap/Container";
import { Route, Routes } from "react-router-dom";
import "./api/axiosDefaults";

// Components
import NavBar from "./components/NavBar";
import PrivateRoute from "./components/common/PrivateRoute";

// Auth
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import { useCurrentUser } from "../src/contexts/CurrentUserContext";

// Workouts
import WorkoutForm from "../src/components/workouts/WorkoutForm";
import WorkoutList from "../src/components/workouts/WorkoutList";
import WorkoutDetail from "../src/components/workouts/WorkoutDetail";

// Profile
import ProfilePage from "./components/profiles/ProfilePage";
// import UsernameForm from "./pages/profiles/UsernameForm";
// import UserPasswordForm from "./pages/profiles/UserPasswordForm";
// import ProfileEditForm from "./pages/profiles/ProfileEditForm";

// Styles
import styles from "./App.module.css";

function App() {
  const currentUser = useCurrentUser();
  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Routes>
          {/* Public Home Route */}
          <Route 
            exact 
            path="/" 
            element={<WorkoutList />}
          />

          {/* Auth Routes */}
          <Route
            path="/signin"
            element={<SignInForm />}
          />
          <Route
            path="/signup"
            element={<SignUpForm />}
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

          {/* Profile Routes */}
          <Route
            path="/profiles/:id"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          
          {/* Profile Edit Routes - Commented out until components are ready */}
          {/* <Route
            path="/profiles/:id/edit/username"
            element={
              <PrivateRoute>
                <UsernameForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/profiles/:id/edit/password"
            element={
              <PrivateRoute>
                <UserPasswordForm />
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
          /> */}

          {/* Feed Routes */}
          <Route
            path="/feed"
            element={
              <PrivateRoute>
                <WorkoutList filter={`owner__followed__owner__profile=${currentUser?.profile_id}&`} />
              </PrivateRoute>
            }
          />
          <Route
            path="/liked"
            element={
              <PrivateRoute>
                <WorkoutList filter={`likes__owner__profile=${currentUser?.profile_id}&ordering=-likes__created_at&`} />
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