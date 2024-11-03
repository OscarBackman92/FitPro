import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  useCurrentUser,
  useSetCurrentUser,
} from '../context/CurrentUserContext';
import Avatar from './Avatar';
import axios from 'axios';
import useClickOutsideToggle from '../hooks/useClickOutsideToggle';
import styles from '../styles/NavBar.module.css';

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const navigate = useNavigate();

  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  const handleSignOut = async () => {
    try {
      // Using correct logout endpoint from URLs.txt
      await axios.post("/api/auth/logout/");
      setCurrentUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const loggedInIcons = (
    <>
      <NavLink 
        className={({ isActive }) => 
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
        to="/workouts/create"
      >
        <i className="fas fa-plus-square"></i> Log Workout
      </NavLink>
      
      <NavLink
        className={({ isActive }) => 
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
        to="/feed"
      >
        <i className="fas fa-stream"></i> Feed
      </NavLink>
      
      <NavLink
        className={({ isActive }) => 
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
        to="/workouts"
      >
        <i className="fas fa-dumbbell"></i> My Workouts
      </NavLink>

      <NavLink 
        className={({ isActive }) => 
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
        to="/goals"
      >
        <i className="fas fa-bullseye"></i> Goals
      </NavLink>

      <span 
        className={styles.NavLink}
        onClick={handleSignOut}
        style={{ cursor: 'pointer' }}
      >
        <i className="fas fa-sign-out-alt"></i> Sign Out
      </span>

      <NavLink
        className={({ isActive }) => 
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
        to={`/profiles/${currentUser?.profile_id}`}
      >
        <Avatar 
          src={currentUser?.profile_image} 
          text={currentUser?.username}
          height={40} 
        />
      </NavLink>
    </>
  );

  const loggedOutIcons = (
    <>
      <NavLink 
        className={({ isActive }) => 
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
        to="/signin"
      >
        <i className="fas fa-sign-in-alt"></i> Sign In
      </NavLink>
      <NavLink 
        className={({ isActive }) => 
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
        to="/signup"
      >
        <i className="fas fa-user-plus"></i> Sign Up
      </NavLink>
    </>
  );

  return (
    <Navbar expanded={expanded} className={styles.NavBar} expand="md" fixed="top">
      <Container>
        <NavLink to="/" className={styles.Logo}>
          FitTracker
        </NavLink>

        <Navbar.Toggle 
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav" 
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavLink 
              className={({ isActive }) => 
                `${styles.NavLink} ${isActive ? styles.Active : ""}`
              }
              to="/"
              end
            >
              <i className="fas fa-home"></i> Home
            </NavLink>

            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;