import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { 
  useCurrentUser,
  useSetCurrentUser,
} from '../context/CurrentUserContext';
import axios from 'axios';
import styles from '../styles/NavBar.module.css';

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await axios.post("/api/auth/logout/");
      setCurrentUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const loggedInIcons = (
    <>
      <Link 
        className={styles.NavLink}
        to="/workouts/create"
      >
        <i className="fas fa-plus-square"></i> Log Workout
      </Link>
      
      <Link
        className={styles.NavLink}
        to="/feed"
      >
        <i className="fas fa-stream"></i> Feed
      </Link>
      
      <Link
        className={styles.NavLink}
        to="/workouts"
      >
        <i className="fas fa-dumbbell"></i> My Workouts
      </Link>

      <span 
        className={styles.NavLink}
        onClick={handleSignOut}
        style={{ cursor: 'pointer' }}
      >
        <i className="fas fa-sign-out-alt"></i> Sign Out
      </span>

      {currentUser && (
        <Link
          className={styles.NavLink}
          to={`/profiles/${currentUser.profile_id}`}
        >
          <img
            src={currentUser.profile_image}
            alt={currentUser.username}
            className={styles.Avatar}
          />
          {currentUser.username}
        </Link>
      )}
    </>
  );

  const loggedOutIcons = (
    <>
      <Link 
        className={styles.NavLink}
        to="/signin"
      >
        <i className="fas fa-sign-in-alt"></i> Sign In
      </Link>
      <Link 
        className={styles.NavLink}
        to="/signup"
      >
        <i className="fas fa-user-plus"></i> Sign Up
      </Link>
    </>
  );

  return (
    <Navbar className={styles.NavBar} expand="md" fixed="top" bg="white">
      <Container>
        <Link to="/" className={styles.NavBrand}>
          FitTracker
        </Link>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Link 
              className={styles.NavLink}
              to="/"
            >
              <i className="fas fa-home"></i> Home
            </Link>

            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;