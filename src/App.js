// src/App.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { CurrentUserProvider } from "./contexts/CurrentUserContext";
import { WorkoutProvider } from "./contexts/WorkoutContext";
import { SocialProvider } from "./contexts/SocialContext";
import "./services/axiosDefaults";

// Layout Components
import NavBar from "./components/common/NavBar";
import Container from "./components/common/Container";
import PrivateRoute from "./components/common/PrivateRoute";


// Auth Pages
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
// import PasswordReset from "./pages/auth/PasswordReset";
// import PasswordResetConfirm from "./pages/auth/PasswordResetConfirm";
// import EmailVerification from "./pages/auth/EmailVerification";

// Profile Pages
import ProfilePage from "./components/profiles/ProfilePage";
import ProfileEditForm from "./components/profiles/ProfileEditForm";
// import ProfileSettings from "./pages/profiles/ProfileSettings";

// Workout Pages
import WorkoutForm from "./components/workouts/WorkoutForm";
import WorkoutList from "./components/workouts/WorkoutList";
import WorkoutDetail from "./components/workouts/WorkoutDetail";
// import WorkoutStats from "./pages/workouts/WorkoutStats";

// // Social Pages
// import Feed from "./pages/social/Feed";
// import Followers from "./pages/social/Followers";
// import Following from "./pages/social/Following";

// Dashboard
import Dashboard from './components/dashboard/Dashboard';

// Error Pages
import NotFound from './components/common/NotFound';

function App() {
  return (
    <CurrentUserProvider>
      <WorkoutProvider>
        <SocialProvider>
          <div className="min-h-screen bg-gray-50">
            <NavBar />
            <Container>
              <Routes>
                {/* Public Routes */}
                <Route path="/signin" element={<SignInForm />} />
                <Route path="/signup" element={<SignUpForm />} />
                {/* <Route path="/password/reset" element={<PasswordReset />} />
                <Route path="/password/reset/confirm/:uid/:token" element={<PasswordResetConfirm />} />
                <Route path="/email/verify/:key" element={<EmailVerification />} /> */}

                {/* Protected Routes */}
                <Route
                  path="/"
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
                      {/* <WorkoutStats /> */}
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
                  path="/profiles/:id/settings"
                  element={
                    <PrivateRoute>
                      {/* <ProfileSettings /> */}
                    </PrivateRoute>
                  }
                />

                {/* Social Routes */}
                {/* <Route
                  path="/feed"
                  element={
                    <PrivateRoute>
                      <Feed />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profiles/:id/followers"
                  element={
                    <PrivateRoute>
                      <Followers />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profiles/:id/following"
                  element={
                    <PrivateRoute>
                      <Following />
                    </PrivateRoute>
                  }
                /> */}

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Container>

            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                className: '',
                duration: 3000,
                success: {
                  style: {
                    background: '#10B981',
                    color: 'white',
                  },
                },
                error: {
                  style: {
                    background: '#EF4444',
                    color: 'white',
                  },
                },
              }}
            />
          </div>
        </SocialProvider>
      </WorkoutProvider>
    </CurrentUserProvider>
  );
}

export default App;