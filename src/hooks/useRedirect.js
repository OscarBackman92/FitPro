import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Custom hook to handle redirection based on user authentication status
const useRedirect = (userAuthStatus) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Function to handle component mount
    const handleMount = async () => {
      try {
        // Attempt to refresh authentication token
        await axios.post("/api/auth/token/refresh/");
        // If user is logged in, navigate to home page
        if (userAuthStatus === "loggedIn") {
          navigate("/");
        }
      } catch (err) {
        // If token refresh fails and user is logged out, navigate to home page
        if (userAuthStatus === "loggedOut") {
          navigate("/");
        }
      }
    };

    // Call the handleMount function when the component mounts
    handleMount();
  }, [navigate, userAuthStatus]);
};

export default useRedirect;