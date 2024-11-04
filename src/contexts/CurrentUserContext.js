import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { useNavigate } from "react-router-dom";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get("/api/profiles/me/");
        setCurrentUser(data);
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    };

    handleMount();
  }, []);

  // Refresh token and session handling
  useEffect(() => {
    const checkToken = async () => {
      try {
        await axiosReq.post("/api/auth/token/refresh/");
      } catch (err) {
        setCurrentUser(null);
        navigate("/signin");
      }
    };

    if (currentUser) {
      // Check token every 5 minutes
      const interval = setInterval(checkToken, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [currentUser, navigate]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};