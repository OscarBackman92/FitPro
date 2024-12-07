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

const router = createBrowserRouter(
  [
    {
      path: "*",
      element: (
        <CurrentUserProvider>
          <ProfileDataProvider>
            <WorkoutProvider>
              <SocialProvider>
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
      v7_startTransition: true,
    }
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);