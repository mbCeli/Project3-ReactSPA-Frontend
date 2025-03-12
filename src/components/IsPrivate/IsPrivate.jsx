import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

function IsPrivate({ children, adminOnly = false }) {
  const { isLoggedIn, isLoading, user } = useContext(AuthContext);

  // If the authentication is still loading, show nothing
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If user is not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // If the route requires admin privileges but user is not an admin
  if (adminOnly && !user?.isAdmin) {
    return <Navigate to="/home" />;
  }

  // If the user is authenticated (and is admin when required), show the protected component
  return children;
}

export default IsPrivate;
