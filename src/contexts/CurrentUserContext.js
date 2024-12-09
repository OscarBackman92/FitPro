import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { axiosReq, axiosRes } from "../services/axiosDefaults";
import { removeTokenTimestamp, shouldRefreshToken } from "../utils/utils";
import toast from "react-hot-toast";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleMount = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setCurrentUser(null);
        setProfileData(null);
        setIsLoading(false);
        return;
      }

      axiosReq.defaults.headers.Authorization = `Bearer ${token}`;
      axiosRes.defaults.headers.Authorization = `Bearer ${token}`;
      
      // Get user and profile data
      const [userResponse, profileResponse] = await Promise.all([
        axiosRes.get("dj-rest-auth/user/"),
        axiosReq.get("/profiles/current/")
      ]);

      const userData = userResponse.data;
      const profileData = profileResponse.data;

      setCurrentUser(userData);
      setProfileData(profileData);
    } catch (err) {
      setCurrentUser(null);
      setProfileData(null);
      localStorage.removeItem('token');
      removeTokenTimestamp();
      toast.error('Session expired. Please sign in again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleMount();
  }, [handleMount]);

  useMemo(() => {
    // Token refresh interceptor
    axiosReq.interceptors.request.use(
      async (config) => {
        if (shouldRefreshToken()) {
          try {
            await axios.post("/dj-rest-auth/token/refresh/");
          } catch (err) {
            setCurrentUser(null);
            setProfileData(null);
            navigate("/signin");
            removeTokenTimestamp();
          }
        }
        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );

    // Response interceptor for handling 401s
    axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401) {
          try {
            await axios.post("/dj-rest-auth/token/refresh/");
            return axios(err.config);
          } catch (refreshErr) {
            setCurrentUser(null);
            setProfileData(null);
            navigate("/signin");
          }
        }
        return Promise.reject(err);
      }
    );
  }, [navigate]);

  const updateProfileData = useCallback(async (newData) => {
    if (!currentUser?.profile?.id) return;

    try {
      const response = await axiosReq.patch(
        `/profiles/${currentUser.profile.id}/`,
        newData
      );
      setProfileData(response.data);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  }, [currentUser?.profile?.id]);

  const contextValue = {
    currentUser,
    profileData,
    isLoading,
    updateProfileData
  };

  return (
    <CurrentUserContext.Provider value={contextValue}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserProvider;