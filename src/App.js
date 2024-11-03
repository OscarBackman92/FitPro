import { BrowserRouter as Router } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Routes, Route } from 'react-router-dom';
import './api/axiosDefaults';
import NavBar from './components/NavBar';
import styles from './App.module.css';
import { CurrentUserProvider } from './context/CurrentUserContext';
import SignInForm from './pages/auth/SignInForm';
import SignUpForm from './pages/auth/SignUpForm';

function App() {
  return (
    <Router>
      <CurrentUserProvider>
        <div className={styles.App}>
          <NavBar />
          <Container className={styles.Main}>
            <Routes>
              <Route 
                exact 
                path="/" 
                element={
                  <h1>Home page will go here</h1>
                }
              />
              <Route 
                path="/signin" 
                element={<SignInForm />} 
              />
              <Route 
                path="/signup" 
                element={<SignUpForm />} 
              />
              <Route 
                path="/workouts" 
                element={
                  <h1>Workouts page will go here</h1>
                } 
              />
              <Route 
                path="/workouts/create" 
                element={
                  <h1>Create workout form will go here</h1>
                } 
              />
              <Route 
                path="/feed" 
                element={
                  <h1>Feed page will go here</h1>
                } 
              />
              <Route 
                path="/goals" 
                element={
                  <h1>Goals page will go here</h1>
                } 
              />
              <Route 
                path="/profiles/:id" 
                element={
                  <h1>Profile page will go here</h1>
                } 
              />
              <Route 
                path="*" 
                element={
                  <h1>404 - Not Found</h1>
                } 
              />
            </Routes>
          </Container>
        </div>
      </CurrentUserProvider>
    </Router>
  );
}

export default App;