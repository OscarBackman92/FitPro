import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useRedirect = (userAuthStatus) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleMount = async () => {
      try {
        await axios.post("/api/auth/token/refresh/");
        if (userAuthStatus === "loggedIn") {
          navigate("/");
        }
      } catch (err) {
        if (userAuthStatus === "loggedOut") {
          navigate("/");
        }
      }
    };

    handleMount();
  }, [navigate, userAuthStatus]);
};

export default useRedirect;