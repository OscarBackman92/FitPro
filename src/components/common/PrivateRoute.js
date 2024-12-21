// Import dependencies
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import LoadingSpinner from "../common/LoadingSpinner";

// Protected route component that requires authentication
const PrivateRoute = ({ children }) => {
 const { currentUser, isLoading } = useCurrentUser();
 const location = useLocation();
 const navigate = useNavigate();

 // Redirect to signin if user is not authenticated
 useEffect(() => {
   if (!isLoading && !currentUser) {
     navigate("/signin", {
       replace: true,
       state: { from: location },
     });
   }
 }, [currentUser, isLoading, navigate, location]);

 // Show loading spinner while checking auth status
 if (isLoading) {
   return (
     <div className="min-h-screen bg-gray-900 flex items-center justify-center">
       <LoadingSpinner size="lg" color="green" />
     </div>
   );
 }

 // Return null if not authenticated
 if (!currentUser) {
   return null;
 }

 return children;
};

export default PrivateRoute;