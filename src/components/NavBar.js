import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';
import useClickOutsideToggle from '../hooks/useClickOutsideToggle';
import { axiosRes } from '../api/axiosDefaults';
import Avatar from './Avatar';
import styles from '../styles/NavBar.module.css';

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  const handleSignOut = async () => {
    try {
      await axiosRes.post('/api/auth/logout/');
      setCurrentUser(null);
    } catch (err) {
      console.log('Error signing out:', err);
    }
  };

  const loggedInIcons = (
    <>
      <NavLink 
        className={styles.NavLink} 
        to="/workouts/create"
        onClick={() => setExpanded(false)}
      >
        <i className="fas fa-plus-circle"></i>
        <span className={styles.LinkText}>Log Workout</span>
      </NavLink>
      
      <NavLink 
        className={styles.NavLink} 
        to="/"
        onClick={() => setExpanded(false)}
      >
        <i className="fas fa-home"></i>
        <span className={styles.LinkText}>Dashboard</span>
      </NavLink>
      
      <NavLink 
        className={styles.NavLink} 
        to="/feed"
        onClick={() => setExpanded(false)}
      >
        <i className="fas fa-fire"></i>
        <span className={styles.LinkText}>Activity Feed</span>
      </NavLink>
      
      <NavLink 
        className={styles.NavLink} 
        to="/workouts"
        onClick={() => setExpanded(false)}
      >
        <i className="fas fa-dumbbell"></i>
        <span className={styles.LinkText}>My Workouts</span>
      </NavLink>

      {currentUser && (
        <NavLink
          className={styles.ProfileLink}
          to={`/profiles/${currentUser.profile_id}`}
          onClick={() => setExpanded(false)}
        >
          <Avatar
            src={currentUser.profile_image || "/default-avatar.png"}
            text={currentUser.username}
            height={40}
          />
        </NavLink>
      )}
      
      <button 
        className={styles.SignOutButton}
        onClick={() => {
          handleSignOut();
          setExpanded(false);
        }}
      >
        <i className="fas fa-sign-out-alt"></i>
        <span className={styles.LinkText}>Sign out</span>
      </button>
    </>
  );

  const loggedOutIcons = (
    <div className={styles.AuthButtons}>
      <NavLink
        className={styles.SignInButton}
        to="/signin"
        onClick={() => setExpanded(false)}
      >
        Sign in
      </NavLink>
      <NavLink
        className={styles.SignUpButton}
        to="/signup"
        onClick={() => setExpanded(false)}
      >
        Sign up
      </NavLink>
    </div>
  );

  return (
    <Navbar expanded={expanded} className={styles.NavBar} expand="md" fixed="top">
      <Container>
        <NavLink to="/" className={styles.Logo} onClick={() => setExpanded(false)}>
          <i className="fas fa-bolt"></i> FITPRO
        </NavLink>

        <Navbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
        />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;