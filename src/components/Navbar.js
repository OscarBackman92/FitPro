import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { 
  useCurrentUser,
  useSetCurrentUser,
} from '../contexts/CurrentUserContext';
import Avatar from './Avatar';
import axios from 'axios';
import useClickOutsideToggle from '../hooks/useClickOutsideToggle';

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  const handleSignOut = async () => {
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  const loggedInIcons = (
    <>
      <NavLink 
        className="nav-link"
        activeClassName="active"
        to="/workouts/create"
      >
        <i className="fas fa-plus-square"></i> Log Workout
      </NavLink>
      
      <NavLink
        className="nav-link"
        activeClassName="active"
        to="/feed"
      >
        <i className="fas fa-stream"></i> Feed
      </NavLink>
      
      <NavLink
        className="nav-link"
        activeClassName="active"
        to="/workouts"
      >
        <i className="fas fa-dumbbell"></i> My Workouts
      </NavLink>

      <NavLink 
        className="nav-link"
        activeClassName="active"
        to="/goals"
      >
        <i className="fas fa-bullseye"></i> Goals
      </NavLink>

      <NavLink
        className="nav-link"
        to="/"
        onClick={handleSignOut}
      >
        <i className="fas fa-sign-out-alt"></i> Sign Out
      </NavLink>

      <NavLink
        className="nav-link"
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
        className="nav-link"
        activeClassName="active"
        to="/signin"
      >
        <i className="fas fa-sign-in-alt"></i> Sign In
      </NavLink>
      <NavLink 
        className="nav-link"
        activeClassName="active"
        to="/signup"
      >
        <i className="fas fa-user-plus"></i> Sign Up
      </NavLink>
    </>
  );

  return (
    <Navbar expanded={expanded} className="bg-white" expand="md" fixed="top">
      <Container>
        <NavLink to="/">
          <Navbar.Brand>
            <img src="/logo.png" alt="logo" height="45" />
            FitTracker
          </Navbar.Brand>
        </NavLink>

        <Navbar.Toggle 
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav" 
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-start">
            <NavLink 
              exact
              className="nav-link"
              activeClassName="active"
              to="/"
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