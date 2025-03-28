import React, { useState, useEffect } from "react";
import authService from "../services/auth.service";

const AuthContext = React.createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const storeToken = (token) => {
    localStorage.setItem("authToken", token);
  };

  const authenticateUser = () => {

    // Get the stored token from the localStorage
    const storedToken = localStorage.getItem("authToken");

    // If the token exists in the localStorage
    if (storedToken) {

      /* Send a request to the server using axios
        axios.get(
          `${process.env.REACT_APP_SERVER_URL}/auth/verify`,
          { headers: { Authorization: `Bearer ${storedToken}` } }
        )
        .then((response) => {})
        */

      // Or using a service send a request to the server
      authService
        .verify()
        .then((response) => {
          // If the server verifies that JWT token is valid  ✅
          const user = response.data;

          // Update state variables
          setIsLoggedIn(true);
          setIsLoading(false);
          setUser(user);
        })
        .catch((error) => {
          // If the server sends an error response (invalid token) ❌
          // Update state variables
          setIsLoggedIn(false);
          setIsLoading(false);
          setUser(null);
        });
    } else {
      // If the token is not available
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  };

  const removeToken = () => {
    localStorage.removeItem("authToken");
  };

  const logOutUser = () => {
    // Upon logout, remove the token from the localStorage
    removeToken();

    // Clear the chat history for the current user
    if (user && user._id) {
      sessionStorage.removeItem(`chat_history_${user._id}`);
    }

    // You might want to clear all session storage related to chat
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("chat_history_")) {
        sessionStorage.removeItem(key);
      }
    });
    
    setIsLoggedIn(false);
    setUser(null);
  };

  useEffect(() => {
    // Run this code once the AuthProviderWrapper component in the App loads for the first time.
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        storeToken,
        authenticateUser,
        logOutUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthProviderWrapper, AuthContext };
