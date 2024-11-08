// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { CurrentUserProvider } from './contexts/CurrentUserContext';
import { Toaster } from 'react-hot-toast'; // Add toast notifications
import './index.css';
import App from './App';

const AppProviders = ({ children }) => (
  <React.StrictMode>
    <Router>
      <CurrentUserProvider>
        {/* Toast notification container */}
        <Toaster 
          position="top-right"
          toastOptions={{
            // Styling for all toasts
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
            // Custom success toast
            success: {
              duration: 3000,
              style: {
                background: '#22c55e', // green-500
              },
            },
            // Custom error toast
            error: {
              duration: 4000,
              style: {
                background: '#ef4444', // red-500
              },
            },
          }}
        />
        {children}
      </CurrentUserProvider>
    </Router>
  </React.StrictMode>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppProviders>
    <App />
  </AppProviders>
);