import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import gameService from "../../services/game.service";
import analyticsService from "../../services/analytics.service"; // Use analytics service instead

import "./HomePage.css";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid2,
  CircularProgress,
  useTheme,
} from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import VideogameAssetOffIcon from "@mui/icons-material/VideogameAssetOff";

function HomePage() {
  const { isLoggedIn, user } = useContext(AuthContext);
  const [lastPlayedGame, setLastPlayedGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const theme = useTheme();

  const navigate = useNavigate();

  // Load custom bubble fonts
  useEffect(() => {
    // Add Google Fonts link for bubble fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Bubblegum+Sans&family=Fredoka+One&family=Luckiest+Guy&display=swap";
    document.head.appendChild(link);

    // Set fonts as loaded after a short delay to ensure they're applied
    const timer = setTimeout(() => {
      setFontsLoaded(true);
    }, 500);

    return () => {
      clearTimeout(timer);
      // Don't remove the link if it might be used by other components
    };
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      if (isLoggedIn && user) {
        try {
          setIsLoading(true);
          console.log("Fetching play history...");
          // Use analyticsService instead of userService for getting play history
          const historyResponse = await analyticsService.getUserPlayHistory();
          console.log("Play history response:", historyResponse.data);

          if (historyResponse.data && historyResponse.data.length > 0) {
            // Sort by date and get the most recent
            const sortedHistory = [...historyResponse.data].sort(
              (a, b) =>
                new Date(b.playedAt || b.playDate) -
                new Date(a.playedAt || a.playDate)
            );
            console.log("Sorted history:", sortedHistory);

            // Check if the game object is already populated
            if (sortedHistory[0] && sortedHistory[0].game) {
              // Game object is already in the response
              setLastPlayedGame(sortedHistory[0].game);
            } else if (sortedHistory[0] && sortedHistory[0].gameId) {
              // If game is not populated but gameId is available
              const gameResponse = await gameService.getGame(
                sortedHistory[0].gameId
              );
              setLastPlayedGame(gameResponse.data);
            }
          }

          setIsLoading(false);
        } catch (err) {
          console.error("Error fetching user data:", err);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    getUserData();
  }, [isLoggedIn, user]);

  // Animation details for floating game icons
  const floatingIcons = [
    { icon: "🎮", delay: 0, duration: 8, left: "5%", top: "15%" },
    { icon: "🎯", delay: 2, duration: 10, left: "15%", top: "60%" },
    { icon: "🏆", delay: 1, duration: 7, left: "80%", top: "20%" },
    { icon: "🎲", delay: 3, duration: 9, left: "85%", top: "70%" },
    { icon: "🎪", delay: 2.5, duration: 11, left: "60%", top: "85%" },
    { icon: "⚔️", delay: 1.5, duration: 8.5, left: "25%", top: "10%" },
    { icon: "🧩", delay: 4, duration: 12, left: "90%", top: "40%" },
    { icon: "🎨", delay: 3.5, duration: 9.5, left: "10%", top: "80%" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #bbdefb 0%, #90caf9 100%)",
        position: "relative",
        overflow: "hidden",
        py: 1,
        transition: "opacity 0.5s ease",
        opacity: fontsLoaded ? 1 : 0,
      }}
    >
      {/* Floating game icons background */}
      {floatingIcons.map((icon, index) => (
        <Typography
          key={index}
          variant="h4"
          component="div"
          sx={{
            position: "absolute",
            left: icon.left,
            top: icon.top,
            fontSize: "2rem",
            opacity: 0.3,
            zIndex: 0,
            animation: `float ${icon.duration}s ease-in-out infinite ${icon.delay}s`,
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
              "50%": { transform: "translateY(-20px) rotate(10deg)" },
            },
          }}
        >
          {icon.icon}
        </Typography>
      ))}

      {/* Decorative circles */}
      <Box
        sx={{
          position: "absolute",
          right: "10%",
          top: "30%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, #ba68c8 0%, rgba(186, 104, 200, 0) 70%)",
          opacity: 0.2,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: "5%",
          bottom: "20%",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, #ffcdd2 0%, rgba(255, 205, 210, 0) 70%)",
          opacity: 0.3,
          zIndex: 0,
        }}
      />

      {/* Main content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "1200px", px: 3 }}>
          <Typography
            variant="h3"
            sx={{
              mb: 3,
              fontFamily: "'Luckiest Guy', cursive",
              color: "#42a5f5",
              textShadow: "3px 3px 0px rgba(0,0,0,0.1)",
              letterSpacing: "1px",
              textAlign: "center",
            }}
          >
            Game Hub
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
              flexWrap: "wrap",
              gap: 1,
              position: "relative",
              background: "rgba(255,255,255,0.7)",
              p: 2,
              borderRadius: 4,
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              transform: "translateY(0)",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
              },
            }}
          >
            {isLoggedIn && user ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                  }}
                >
                  <SportsEsportsIcon
                    sx={{
                      fontSize: 40,
                      color: "#ba68c8",
                      animation: "pulse 2s infinite",
                      "@keyframes pulse": {
                        "0%": { transform: "scale(1)" },
                        "50%": { transform: "scale(1.1)" },
                        "100%": { transform: "scale(1)" },
                      },
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "'Fredoka One', cursive",
                      color: "#212121",
                    }}
                  >
                    Welcome{" "}
                    <span style={{ color: "#ba68c8" }}>{user.username}</span>
                  </Typography>
                  {user.isAdmin ? (
                    <>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontFamily: "'Bubblegum Sans', cursive",
                          backgroundColor: "rgba(66, 165, 245, 0.2)",
                          borderRadius: 2,
                          px: 2,
                          py: 0.5,
                        }}
                      >
                        You have admin privileges
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontFamily: "'Bubblegum Sans', cursive",
                          backgroundColor: "rgba(102, 187, 106, 0.2)",
                          borderRadius: 2,
                          px: 2,
                          py: 0.5,
                        }}
                      >
                        Time to have fun
                      </Typography>
                    </>
                  )}
                </Box>
              </>
            ) : (
              <>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "'Fredoka One', cursive",
                    color: "#212121",
                  }}
                >
                  You are not logged in
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate("/login")}
                  size="medium"
                  sx={{
                    borderRadius: 28,
                    px: 3,
                    py: 1,
                    fontFamily: "'Fredoka One', cursive",
                    textTransform: "none",
                    boxShadow: "0 4px 10px rgba(186, 104, 200, 0.4)",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  Log In
                </Button>
              </>
            )}
          </Box>

          {isLoggedIn && (
            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                width: "100%",
              }}
            >
              <Grid2 container spacing={3} sx={{ maxWidth: "1200px" }}>
                {/* Game Library Card */}
                <Grid2
                  item
                  xs={12}
                  md={6}
                  sx={{
                    display: "flex",
                    flex: 2,
                  }}
                >
                  <Card
                    sx={{
                      width: "100%",
                      height: "500px",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                      borderRadius: 5,
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-10px)",
                        boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
                      },
                      flexGrow: 2,
                      overflow: "hidden",
                      position: "relative",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {/* Background pattern for card */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.05,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        zIndex: 0,
                      }}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 4,
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        align="center"
                        sx={{
                          fontFamily: "'Luckiest Guy', cursive",
                          color: "#42a5f5",
                          mb: 2,
                          position: "relative",
                          display: "inline-block",
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            bottom: -8,
                            left: "10%",
                            width: "80%",
                            height: 3,
                            backgroundColor: "#42a5f5",
                            borderRadius: 2,
                          },
                        }}
                      >
                        Game Library
                      </Typography>
                      <Typography
                        variant="body1"
                        align="center"
                        sx={{
                          mb: 3,
                          fontFamily: "'Bubblegum Sans', cursive",
                          fontSize: "1.1rem",
                        }}
                      >
                        Explore our collection of games and find your next
                        favorite!
                      </Typography>
                      <Box sx={{ position: "relative", width: "100%" }}>
                        <Box
                          sx={{
                            width: "100%",
                            height: "200px",
                            borderRadius: 4,
                            background:
                              "linear-gradient(45deg, #42a5f5, #90caf9)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          <VideogameAssetIcon
                            sx={{
                              fontSize: 80,
                              color: "rgba(255,255,255,0.9)",
                              animation: "float-icon 3s ease-in-out infinite",
                              "@keyframes float-icon": {
                                "0%, 100%": {
                                  transform: "translateY(0) scale(1)",
                                },
                                "50%": {
                                  transform: "translateY(-10px) scale(1.1)",
                                },
                              },
                            }}
                          />

                          {/* Animated particles */}
                          {[...Array(8)].map((_, i) => (
                            <Box
                              key={`particle-lib-${i}`}
                              sx={{
                                position: "absolute",
                                width: 10 + Math.random() * 10,
                                height: 10 + Math.random() * 10,
                                backgroundColor: "rgba(255,255,255,0.7)",
                                borderRadius: "50%",
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animation: `particle ${
                                  3 + Math.random() * 4
                                }s linear infinite ${Math.random() * 2}s`,
                                "@keyframes particle": {
                                  "0%": {
                                    transform: "translate(0, 0) scale(1)",
                                    opacity: 0,
                                  },
                                  "50%": { opacity: 0.8 },
                                  "100%": {
                                    transform: `translate(${
                                      Math.random() * 60 - 30
                                    }px, ${
                                      Math.random() * 60 - 30
                                    }px) scale(0)`,
                                    opacity: 0,
                                  },
                                },
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions
                      sx={{ p: 2, pt: 0, position: "relative", zIndex: 1 }}
                    >
                      <Button
                        variant="contained"
                        component={Link}
                        to="/games"
                        fullWidth
                        size="large"
                        sx={{
                          py: 1.5,
                          borderRadius: 6,
                          fontFamily: "'Fredoka One', cursive",
                          fontSize: "1.1rem",
                          textTransform: "none",
                          background:
                            "linear-gradient(45deg, #42a5f5, #1976d2)",
                          boxShadow: "0 4px 15px rgba(66, 165, 245, 0.4)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 8px 20px rgba(66, 165, 245, 0.6)",
                          },
                        }}
                      >
                        Browse Games
                      </Button>
                    </CardActions>
                  </Card>
                </Grid2>

                {/* Last Played Game Card */}
                <Grid2
                  item
                  xs={12}
                  md={6}
                  sx={{
                    display: "flex",
                    flex: 2,
                  }}
                >
                  <Card
                    sx={{
                      width: "100%",
                      height: "500px",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                      borderRadius: 5,
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-10px)",
                        boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
                      },
                      flexGrow: 2,
                      overflow: "hidden",
                      position: "relative",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {/* Background pattern for card */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.05,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        zIndex: 0,
                      }}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 4,
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        align="center"
                        sx={{
                          fontFamily: "'Luckiest Guy', cursive",
                          color: "#ba68c8",
                          mb: 2,
                          position: "relative",
                          display: "inline-block",
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            bottom: -8,
                            left: "10%",
                            width: "80%",
                            height: 3,
                            backgroundColor: "#ba68c8",
                            borderRadius: 2,
                          },
                        }}
                      >
                        Last Played Game
                      </Typography>

                      {isLoading ? (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 2,
                          }}
                        >
                          <CircularProgress
                            size={40}
                            sx={{ color: "#ba68c8" }}
                          />
                        </Box>
                      ) : lastPlayedGame ? (
                        <Typography
                          variant="body1"
                          align="center"
                          sx={{
                            mb: 3,
                            fontFamily: "'Bubblegum Sans', cursive",
                            fontSize: "1.1rem",
                          }}
                        >
                          Continue playing{" "}
                          <strong style={{ color: "#ba68c8" }}>
                            {lastPlayedGame.title}
                          </strong>
                        </Typography>
                      ) : (
                        <Typography
                          variant="body1"
                          align="center"
                          sx={{
                            mb: 3,
                            fontFamily: "'Bubblegum Sans', cursive",
                            fontSize: "1.1rem",
                          }}
                        >
                          You haven't played any games yet! What are you waiting
                          for?
                        </Typography>
                      )}
                      <Box sx={{ position: "relative", width: "100%" }}>
                        <Box
                          sx={{
                            width: "100%",
                            height: "200px",
                            borderRadius: 4,
                            background:
                              "linear-gradient(45deg, #ba68c8, #ce93d8)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          {lastPlayedGame ? (
                            <VideogameAssetIcon
                              sx={{
                                fontSize: 80,
                                color: "rgba(255,255,255,0.9)",
                                animation: "pulse-icon 3s ease-in-out infinite",
                                "@keyframes pulse-icon": {
                                  "0%, 100%": { transform: "scale(1)" },
                                  "50%": { transform: "scale(1.2)" },
                                },
                              }}
                            />
                          ) : (
                            <VideogameAssetOffIcon
                              sx={{
                                fontSize: 80,
                                color: "rgba(255,255,255,0.9)",
                                animation: "shake-icon 7s ease-in-out infinite",
                                "@keyframes shake-icon": {
                                  "0%, 100%": { transform: "rotate(0deg)" },
                                  "5%, 15%": { transform: "rotate(-10deg)" },
                                  "10%, 20%": { transform: "rotate(10deg)" },
                                  "25%": { transform: "rotate(0deg)" },
                                },
                              }}
                            />
                          )}

                          {/* Animated particles */}
                          {[...Array(8)].map((_, i) => (
                            <Box
                              key={`particle-last-${i}`}
                              sx={{
                                position: "absolute",
                                width: 10 + Math.random() * 10,
                                height: 10 + Math.random() * 10,
                                backgroundColor: "rgba(255,255,255,0.7)",
                                borderRadius: "50%",
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animation: `particle ${
                                  3 + Math.random() * 4
                                }s linear infinite ${Math.random() * 2}s`,
                                "@keyframes particle": {
                                  "0%": {
                                    transform: "translate(0, 0) scale(1)",
                                    opacity: 0,
                                  },
                                  "50%": { opacity: 0.8 },
                                  "100%": {
                                    transform: `translate(${
                                      Math.random() * 60 - 30
                                    }px, ${
                                      Math.random() * 60 - 30
                                    }px) scale(0)`,
                                    opacity: 0,
                                  },
                                },
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions
                      sx={{ p: 2, pt: 0, position: "relative", zIndex: 1 }}
                    >
                      {lastPlayedGame ? (
                        <Button
                          variant="contained"
                          color="secondary"
                          component={Link}
                          to={`/games/${lastPlayedGame._id}`}
                          fullWidth
                          size="large"
                          sx={{
                            py: 1.5,
                            borderRadius: 6,
                            fontFamily: "'Fredoka One', cursive",
                            fontSize: "1.1rem",
                            textTransform: "none",
                            background:
                              "linear-gradient(45deg, #ba68c8, #9c27b0)",
                            boxShadow: "0 4px 15px rgba(186, 104, 200, 0.4)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-3px)",
                              boxShadow: "0 8px 20px rgba(186, 104, 200, 0.6)",
                            },
                          }}
                        >
                          Resume Game
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          component={Link}
                          to="/games"
                          fullWidth
                          disabled={isLoading}
                          size="large"
                          sx={{
                            py: 1.5,
                            borderRadius: 6,
                            fontFamily: "'Fredoka One', cursive",
                            fontSize: "1.1rem",
                            textTransform: "none",
                            background:
                              "linear-gradient(45deg, #ba68c8, #9c27b0)",
                            boxShadow: "0 4px 15px rgba(186, 104, 200, 0.4)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-3px)",
                              boxShadow: "0 8px 20px rgba(186, 104, 200, 0.6)",
                            },
                            "&.Mui-disabled": {
                              background:
                                "linear-gradient(45deg, #cccccc, #999999)",
                              color: "rgba(255,255,255,0.7)",
                            },
                          }}
                        >
                          Find Games
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid2>
              </Grid2>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default HomePage;
