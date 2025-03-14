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
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const { user, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [clickedButton, setClickedButton] = useState(null);
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Load custom bubble fonts
  useEffect(() => {
    // Check if fonts are already loaded (avoid duplicate link elements)
    if (!document.querySelector('link[href*="Bubblegum+Sans"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Bubblegum+Sans&family=Fredoka+One&family=Luckiest+Guy&display=swap";
      document.head.appendChild(link);
    }

    const timer = setTimeout(() => {
      setFontsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

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
  }, [location.pathname]); // This will run whenever the URL path changes

  // Check if we're on a game detail page and if the game is playing
  const isGameDetailPage = location.pathname.includes("/games/");
  const urlParams = new URLSearchParams(location.search);
  const isPlaying = urlParams.get("playing") === "true";

  // Check for global "playing" event listeners
  useEffect(() => {
    // Function to listen for custom "game started" event
    const handleGameStarted = () => {
      setIsSidebarVisible(false);
    };

    // Function to listen for custom "game ended" event
    const handleGameEnded = () => {
      setIsSidebarVisible(true);
    };

    // Add event listeners
    window.addEventListener("gameStarted", handleGameStarted);
    window.addEventListener("gameEnded", handleGameEnded);

    // Clean up
    return () => {
      window.removeEventListener("gameStarted", handleGameStarted);
      window.removeEventListener("gameEnded", handleGameEnded);
    };
  }, []);

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
    backgroundColor: "rgba(248, 187, 208, 0.9)", // Updated to use rgba for transparency
    backdropFilter: "blur(10px)",
    boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.15)",
    width: 70,
    zIndex: 1000,
    border: "3px solid rgba(255, 255, 255, 0.6)",
    transition: "opacity 0.5s ease",
    opacity: fontsLoaded ? 1 : 0,
  };

  // Updated style for buttons with bubble style
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
    borderRadius: "50%", // Make buttons circular
    transition: "all 0.3s ease", // Smooth transition for all properties
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
    animate: { scale: 1.3, opacity: 0, transition: { duration: 0.5 } },
  };

  // Hide sidebar on certain pages or when playing a game
  if (
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/logout" ||
    location.pathname === "*" || //Not found
    location.pathname === "/" ||
    isGameDetailPage && !isPlaying ||
    !isSidebarVisible
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
        transition={{ duration: 0.3, type: "spring", stiffness: 120 }}
        sx={sidebarStyle}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: "absolute",
            left: -15,
            top: -15,
            width: 30,
            height: 30,
            borderRadius: "50%",
            backgroundColor: "#ffcdd2",
            opacity: 0.6,
            animation: "float 6s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-10px)" },
            },
            zIndex: -1,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            right: -10,
            bottom: -15,
            width: 25,
            height: 25,
            borderRadius: "50%",
            backgroundColor: "#42a5f5",
            opacity: 0.5,
            animation: "float 7s ease-in-out infinite 1s",
            zIndex: -1,
          }}
        />

        {/* Active indicator */}
        <Box
          sx={{
            backgroundColor: "background.default", // Outer circle color - keeping original
            borderRadius: "50%",
            position: "absolute",
            width: 60,
            height: 60,
            right: -22,
            top: `${15 + activeButtonIndex * 60}px`, // Position based on active button
            zIndex: -1,
            transition: "top 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)", // Spring-like effect
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Box
          sx={{
            backgroundColor: "rgba(248, 187, 208, 0.9)", // Inner circle color - keeping original
            borderRadius: "50%",
            position: "absolute",
            width: 50,
            height: 50,
            right: -17,
            top: `${20 + activeButtonIndex * 60}px`, // Position based on active button
            boxShadow: "inset 0px 1px 3px rgba(0,0,0,0.1)",
            transition: "top 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)", // Spring-like effect
          }}
        />

        {/* Home Button */}
        <Box sx={{ position: "relative" }}>
          <Tooltip
            title="Home"
            placement="right"
            arrow
            sx={{
              "& .MuiTooltip-tooltip": {
                fontFamily: "'Bubblegum Sans', cursive",
                fontSize: "1rem",
                borderRadius: 2,
              },
            }}
          >
            <IconButton
              sx={{
                ...buttonStyle,
                color: isActive("/home") ? "#ffffff" : "#42a5f5",
                position: "relative",
                zIndex: 2,
                transform: isActive("/home")
                  ? "translateX(26px)"
                  : "translateX(0)",
                transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
              onClick={() => handleNavigation("/home", 0)} // Pass 0 as the index for Home
              disableRipple
            >
              <HomeIcon fontSize="medium" />

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
                    border: "3px solid #42a5f5",
                    zIndex: -1,
                  }}
                />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Back Button */}
        <Box sx={{ position: "relative" }}>
          <Tooltip
            title="Go Back"
            placement="right"
            arrow
            sx={{
              "& .MuiTooltip-tooltip": {
                fontFamily: "'Bubblegum Sans', cursive",
                fontSize: "1rem",
                borderRadius: 2,
              },
            }}
          >
            <IconButton
              sx={{
                ...buttonStyle,
                position: "relative",
                zIndex: 2,
                color: "#424242",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  transform: "scale(1.1) rotate(-10deg)", // Rotate on hover
                },
              }}
              onClick={handleGoBack}
              disableRipple
            >
              <ArrowBackIcon fontSize="medium" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Games Button */}
        {isLoggedIn && (
          <Box sx={{ position: "relative" }}>
            <Tooltip
              title="Games"
              placement="right"
              arrow
              sx={{
                "& .MuiTooltip-tooltip": {
                  fontFamily: "'Bubblegum Sans', cursive",
                  fontSize: "1rem",
                  borderRadius: 2,
                },
              }}
            >
              <IconButton
                sx={{
                  ...buttonStyle,
                  color: isActive("/games") ? "#ffffff" : "#42a5f5",
                  position: "relative",
                  zIndex: 2,
                  transform: isActive("/games")
                    ? "translateX(26px)"
                    : "translateX(0)",
                  transition:
                    "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
                onClick={() => handleNavigation("/games", 2)}
                disableRipple
              >
                <SportsEsportsIcon
                  fontSize="medium"
                  sx={
                    isActive("/games")
                      ? {
                          animation: "pulse 2s infinite",
                          "@keyframes pulse": {
                            "0%": { transform: "scale(1)" },
                            "50%": { transform: "scale(1.2)" },
                            "100%": { transform: "scale(1)" },
                          },
                        }
                      : {}
                  }
                />

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
                      border: "3px solid #42a5f5",
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
            <Tooltip
              title="Leaderboard"
              placement="right"
              arrow
              sx={{
                "& .MuiTooltip-tooltip": {
                  fontFamily: "'Bubblegum Sans', cursive",
                  fontSize: "1rem",
                  borderRadius: 2,
                },
              }}
            >
              <IconButton
                sx={{
                  ...buttonStyle,
                  color: isActive("/leaderboard") ? "#ffffff" : "#42a5f5",
                  position: "relative",
                  zIndex: 2,
                  transform: isActive("/leaderboard")
                    ? "translateX(26px)"
                    : "translateX(0)",
                  transition:
                    "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
                onClick={() => handleNavigation("/leaderboard", 3)}
                disableRipple
              >
                <LeaderboardIcon fontSize="medium" />

                {/* Click animation circle */}
                {clickedButton === "leaderboard" && (
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
                      border: "3px solid #42a5f5",
                      zIndex: -1,
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* Profile Button - Only if logged in */}
        {isLoggedIn && (
          <Box sx={{ position: "relative" }}>
            <Tooltip
              title="Profile"
              placement="right"
              arrow
              sx={{
                "& .MuiTooltip-tooltip": {
                  fontFamily: "'Bubblegum Sans', cursive",
                  fontSize: "1rem",
                  borderRadius: 2,
                },
              }}
            >
              <IconButton
                sx={{
                  ...buttonStyle,
                  color: isActive("/profile") ? "#ffffff" : "#42a5f5",
                  position: "relative",
                  zIndex: 2,
                  transform: isActive("/profile")
                    ? "translateX(26px)"
                    : "translateX(0)",
                  transition:
                    "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
                onClick={() => handleNavigation("/profile", 4)}
                disableRipple
              >
                <PersonIcon fontSize="medium" />

                {/* Click animation circle */}
                {clickedButton === "profile" && (
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
                      border: "3px solid #42a5f5",
                      zIndex: -1,
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* Admin Dashboard Button - Only if admin */}
        {isLoggedIn && user?.isAdmin && (
          <Box sx={{ position: "relative" }}>
            <Tooltip
              title="Admin Dashboard"
              placement="right"
              arrow
              sx={{
                "& .MuiTooltip-tooltip": {
                  fontFamily: "'Bubblegum Sans', cursive",
                  fontSize: "1rem",
                  borderRadius: 2,
                },
              }}
            >
              <IconButton
                sx={{
                  ...buttonStyle,
                  color: isActive("/admin/dashboard") ? "#ffffff" : "#42a5f5",
                  position: "relative",
                  zIndex: 2,
                  transform: isActive("/admin/dashboard")
                    ? "translateX(26px)"
                    : "translateX(0)",
                  transition:
                    "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
                onClick={() => handleNavigation("/admin/dashboard", 5)}
                disableRipple
              >
                <DashboardIcon fontSize="medium" />

                {/* Click animation circle */}
                {clickedButton === "admin" && (
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
                      border: "3px solid #42a5f5",
                      zIndex: -1,
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* Logout Button - Only if logged in */}
        {isLoggedIn && (
          <Box sx={{ position: "relative" }}>
            <Tooltip
              title="Logout"
              placement="right"
              arrow
              sx={{
                "& .MuiTooltip-tooltip": {
                  fontFamily: "'Bubblegum Sans', cursive",
                  fontSize: "1rem",
                  borderRadius: 2,
                },
              }}
            >
              <IconButton
                sx={{
                  ...buttonStyle,
                  position: "relative",
                  zIndex: 2,
                  "&:hover": {
                    backgroundColor: "rgba(255, 205, 210, 0.3)",
                    transform: "scale(1.1)",
                  },
                }}
                onClick={handleLogout}
                disableRipple
              >
                <LogoutIcon fontSize="medium" sx={{ color: "#f44336" }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Paper>
    </AnimatePresence>
  );
};

export default Sidebar;
