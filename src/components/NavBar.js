import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useCurrentUser, useSetCurrentUser } from "../contexts/CurrentUserContext";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";
import { apiService } from "../services/apiService";
import Avatar from "./Avatar";
import styles from "../styles/NavBar.module.css";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  const handleSignOut = async () => {
    try {
      await apiService.logout();
      setCurrentUser(null);
    } catch (err) {
      console.log("Error signing out:", err);
    }
  };

  return (
    <Navbar expanded={expanded} className={styles.NavBar} expand="md" fixed="top">
      <Container>
        <NavLink to="/" className={styles.Brand}>
          <Navbar.Brand>Fitness Tracker</Navbar.Brand>
        </NavLink>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(!expanded)}
          ref={ref}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {currentUser ? (
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
            ) : (
              <div className={styles.AuthButtons}>
                <NavLink
                  className={styles.SignInButton}
                  to="/signin"
                  onClick={() => setExpanded(false)}
                >
                  Sign In
                </NavLink>
                <NavLink
                  className={styles.SignUpButton}
                  to="/signup"
                  onClick={() => setExpanded(false)}
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
