import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const handleMount = async () => {
    try {
      const user = await apiService.getCurrentUser();
      setCurrentUser(user);
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  useEffect(() => {
    // Token refresh interval
    const interval = setInterval(() => {
      if (currentUser) {
        apiService.refreshToken().catch(() => {
          setCurrentUser(null);
          navigate('/signin');
        });
      }
    }, 1000 * 60 * 4); // Refresh every 4 minutes

    return () => clearInterval(interval);
  }, [currentUser, navigate]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserProvider;