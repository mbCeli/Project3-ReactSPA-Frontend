import { useContext } from "react";
import { AuthContext } from "../../context/Auth.context";
import { Navigate } from "react-router-dom";
import Loading from "../common/Loading/Loading";

function IsPrivate({ children, adminOnly }) {
  const { isLoggedIn, isLoading, user } = useContext(AuthContext);

  // If the authentication is still loading ⏳
  if (isLoading) {
    return <Loading />;
  }

  if (!isLoggedIn) {
    // If the user is not logged in navigate to the login page ❌
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/home" />
  }

  // If the user is logged in, allow to see the page ✅
  return children;
}

export default IsPrivate;
