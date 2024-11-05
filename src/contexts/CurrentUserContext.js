import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";

const DEBUG = process.env.NODE_ENV === 'development';

const logDebug = (message, data = null) => {
    if (DEBUG) {
        console.log(`[CurrentUserContext] ${message}`, data || '');
    }
};

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    logDebug('No token found, skipping user fetch');
                    setIsLoading(false);
                    return;
                }

                logDebug('Fetching current user...');
                const { data } = await axiosReq.get('/auth/user/');
                setCurrentUser(data);
                logDebug('Current user fetched:', data);
            } catch (err) {
                logDebug('Error fetching current user:', err);
                // Clear token if unauthorized
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                }
                setCurrentUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <SetCurrentUserContext.Provider value={setCurrentUser}>
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    children
                )}
            </SetCurrentUserContext.Provider>
        </CurrentUserContext.Provider>
    );
};