import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CurrentUserProvider } from './contexts/CurrentUserContext';
import { WorkoutProvider } from './contexts/WorkoutContext';
import { ProfileDataProvider } from './contexts/ProfileDataContext';
import { SocialProvider } from './contexts/SocialContext';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App';

// Create a router with a single route that matches all paths
const router = createBrowserRouter(
  [
    {
      path: "*",
      element: (
        // Provide current user context to the entire app
        <CurrentUserProvider>
          {/* Provide profile data context to the entire app */}
          <ProfileDataProvider>
            {/* Provide workout context to the entire app */}
            <WorkoutProvider>
              {/* Provide social context to the entire app */}
              <SocialProvider>
                {/* Configure and display toast notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: { background: '#333', color: '#fff' },
                    success: {
                      duration: 3000,
                      style: { background: '#22c55e' },
                    },
                    error: {
                      duration: 4000,
                      style: { background: '#ef4444' },
                    },
                  }}
                />
                {/* Render the main App component */}
                <App />
              </SocialProvider>
            </WorkoutProvider>
          </ProfileDataProvider>
        </CurrentUserProvider>
      ),
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true
    }
  }
);

// Create a root element and render the router provider
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);