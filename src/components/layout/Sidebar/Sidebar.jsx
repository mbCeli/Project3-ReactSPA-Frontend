import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import "./Sidebar.css";
import { Box, IconButton, Paper, Tooltip } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const { user, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [clickedButton, setClickedButton] = useState(null);

  const [activeButtonIndex, setActiveButtonIndex] = useState(0);
  useEffect(() => {
    // Determine active button index based on current location
    if (location.pathname === "/home" || location.pathname === "/") {
      setActiveButtonIndex(0);
    } else if (location.pathname.includes("/admin")) {
      // All admin routes should highlight the admin dashboard icon
      setActiveButtonIndex(5);
    } else if (
      location.pathname === "/games" ||
      (location.pathname.includes("/games/") &&
        !location.pathname.includes("/admin"))
    ) {
      setActiveButtonIndex(2);
    } else if (location.pathname.includes("/leaderboard")) {
      setActiveButtonIndex(3);
    } else if (location.pathname.includes("/profile")) {
      setActiveButtonIndex(4);
    }
    // Don't set a default here, as we want to keep the current index if none of the conditions match
  }, [location.pathname]); // This will run whenever the URL path changes

  // Check if we're on a game detail page and if the game is playing
  const isGameDetailPage = location.pathname.includes("/games/");
  const urlParams = new URLSearchParams(location.search);
  const isPlaying = urlParams.get("playing") === "true";

  // If on game detail page and game is playing, don't show sidebar
  if (isGameDetailPage && isPlaying) {
    return null;
  }

  // Style for the sidebar container
  const sidebarStyle = {
    position: "fixed",
    left: 20,
    top: "25%",
    transform: "translateY(-25%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 30,
    padding: "15px 10px",
    backgroundColor: "custom.mediumPink",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)",
    width: 70,
    zIndex: 1000,
  };

  // Style for buttons
  const buttonStyle = {
    padding: 0,
    width: 50,
    height: 50,
    margin: "5px 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    border: "none",
    boxShadow: "none",
    borderRadius: "0",
    transition: "transform 0.3s ease", // Add smooth transition
  };

  // Check if path is active
  const isActive = (path) => {
    if (path === "/home") {
      return location.pathname === "/home";
    }
    if (path === "/admin/dashboard") {
      return location.pathname.includes("/admin");
    }
    return (
      location.pathname.includes(path) && !location.pathname.includes("/admin")
    );
  };

  // Handle navigation with animation
  const handleNavigation = (path, buttonIndex) => {
    setClickedButton(path);
    setActiveButtonIndex(buttonIndex);

    // Add a slight delay to allow the animation to play
    setTimeout(() => {
      navigate(path);
      setClickedButton(null);
    }, 300);
  };

  const handleGoBack = () => {
    // Handle special cases
    if (location.pathname.includes("/games/")) {
      navigate("/games");
    } else if (
      location.pathname === "/admin/dashboard" ||
      location.pathname === "/profile" ||
      location.pathname.includes("/admin/")
    ) {
      navigate("/home");
    } else {
      navigate(-1);
    }
  };

  const handleLogout = () => {
    navigate("/logout");
  };

  // Circle animation variants for click effect
  const circleVariants = {
    initial: { scale: 0, opacity: 0.8 },
    animate: { scale: 1, opacity: 0, transition: { duration: 0.3 } },
  };

  if (
    //if on the login, signup, or logout page, don't show me the sidebar
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/logout" ||
    location.pathname === "/"
  ) {
    return null;
  }

  return (
    <AnimatePresence>
      <Paper
        component={motion.div}
        elevation={3}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        sx={sidebarStyle}
      >
        <Box
          sx={{
            backgroundColor: "background.default", // Outer circle color
            borderRadius: "50%",
            position: "absolute",
            width: 60,
            height: 60,
            right: -22,
            top: `${15 + activeButtonIndex * 60}px`, // Position based on active button
            zIndex: -1,
            transition: "top 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)", // Longer duration with spring-like effect
          }}
        />
        <Box
          sx={{
            backgroundColor: "custom.mediumPink", // Inner circle color
            borderRadius: "50%",
            position: "absolute",
            width: 50,
            height: 50,
            right: -17,
            top: `${20 + activeButtonIndex * 60}px`, // Position based on active button
            boxShadow: "inset 0px 1px 3px rgba(0,0,0,0.1)",
            transition: "top 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)", // Longer duration with spring-like effect
          }}
        />
        {/* Home Button */}
        <Box sx={{ position: "relative" }}>
          <Tooltip title="Home" placement="right">
            <IconButton
              sx={{
                ...buttonStyle,
                color: isActive("/home") ? "#f5f5f5" : "inherit",
                position: "relative",
                zIndex: 2,
                transform: isActive("/home")
                  ? "translateX(26px)"
                  : "translateX(0)",
              }}
              onClick={() => handleNavigation("/home", 0)} // Pass 0 as the index for Home
              disableRipple
            >
              <HomeIcon />

              {/* Click animation circle */}
              {clickedButton === "home" && (
                <Box
                  component={motion.div}
                  initial="initial"
                  animate="animate"
                  variants={circleVariants}
                  sx={{
                    position: "absolute",
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    border: "2px solid orange",
                    zIndex: -1,
                  }}
                />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Back Button */}
        <Box sx={{ position: "relative" }}>
          <Tooltip title="Go Back" placement="right">
            <IconButton
              sx={{
                ...buttonStyle,
                position: "relative",
                zIndex: 2,
              }}
              onClick={handleGoBack}
              disableRipple
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Games Button */}
        {isLoggedIn && (
          <Box sx={{ position: "relative" }}>
            <Tooltip title="Games" placement="right">
              <IconButton
                sx={{
                  ...buttonStyle,
                  color: isActive("/games") ? "#f5f5f5" : "inherit",
                  position: "relative",
                  zIndex: 2,
                  transform: isActive("/games")
                    ? "translateX(26px)"
                    : "translateX(0)",
                }}
                onClick={() => handleNavigation("/games", 2)}
                disableRipple
              >
                <SportsEsportsIcon />

                {/* Click animation circle */}
                {clickedButton === "games" && (
                  <Box
                    component={motion.div}
                    initial="initial"
                    animate="animate"
                    variants={circleVariants}
                    sx={{
                      position: "absolute",
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      border: "2px solid orange",
                      zIndex: -1,
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* Leaderboard Button */}
        {isLoggedIn && (
          <Box sx={{ position: "relative" }}>
            <Tooltip title="Leaderboard" placement="right">
              <IconButton
                sx={{
                  ...buttonStyle,
                  color: isActive("/leaderboard") ? "#f5f5f5" : "inherit",
                  position: "relative",
                  zIndex: 2,
                  transform: isActive("/leaderboard")
                    ? "translateX(26px)"
                    : "translateX(0)",
                }}
                onClick={() => handleNavigation("/leaderboard", 3)}
                disableRipple
              >
                <LeaderboardIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* Profile Button - Only if logged in */}
        {isLoggedIn && (
          <Box sx={{ position: "relative" }}>
            <Tooltip title="Profile" placement="right">
              <IconButton
                sx={{
                  ...buttonStyle,
                  color: isActive("/profile") ? "#f5f5f5" : "inherit",
                  position: "relative",
                  zIndex: 2,
                  transform: isActive("/profile")
                    ? "translateX(26px)"
                    : "translateX(0)",
                }}
                onClick={() => handleNavigation("/profile", 4)}
                disableRipple
              >
                <PersonIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* Admin Dashboard Button - Only if admin */}
        {isLoggedIn && user?.isAdmin && (
          <Box sx={{ position: "relative" }}>
            <Tooltip title="Admin Dashboard" placement="right">
              <IconButton
                sx={{
                  ...buttonStyle,
                  color: isActive("/admin/dashboard") ? "#f5f5f5" : "inherit",
                  position: "relative",
                  zIndex: 2,
                  transform: isActive("/admin/dashboard")
                    ? "translateX(26px)"
                    : "translateX(0)",
                }}
                onClick={() => handleNavigation("/admin/dashboard", 5)}
                disableRipple
              >
                <DashboardIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* Logout Button - Only if logged in */}
        {isLoggedIn && (
          <Box sx={{ position: "relative" }}>
            <Tooltip title="Logout" placement="right">
              <IconButton
                sx={{
                  ...buttonStyle,
                  position: "relative",
                  zIndex: 2,
                }}
                onClick={handleLogout}
                disableRipple
              >
                <LogoutIcon color="error" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Paper>
    </AnimatePresence>
  );
};

export default Sidebar;
