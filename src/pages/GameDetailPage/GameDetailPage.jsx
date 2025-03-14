import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import gameService from "../../services/game.service";
import userService from "../../services/user.service";
import GameStats from "../../components/games/GameStats/GameStats";
import CommentsSection from "../../components/ratings/RatingStats/CommentsRatings";

import "./GameDetailPage.css";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Paper,
  Link,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";

function GameDetailPage() {
  const { id } = useParams();
  const { user, isLoggedIn } = useContext(AuthContext);

  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameUrl, setGameUrl] = useState("");
  const [isFrameLoading, setIsFrameLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false); // Animation state for favorite
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const iframeRef = useRef(null);

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
    const fetchGameDetails = async () => {
      try {
        setIsLoading(true);
        // Fetch game details
        const gameResponse = await gameService.getGame(id);
        setGame(gameResponse.data);

        // Get the game URL from your backend response
        setGameUrl(gameResponse.data.gameUrl);

        // Check if game is in favorites
        const favorited = await userService.isGameFavourited(id);
        setIsFavorite(favorited);

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching game details:", err);
        setError("Failed to load game details. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  const handlePlayGame = async () => {
    try {
      // Log play session
      await gameService.postPlaySession(id, { userId: user?._id });

      // Reset iframe loading state
      setIsFrameLoading(true);

      // Update URL parameter immediately (before state update)
      const url = new URL(window.location);
      url.searchParams.set("playing", "true");
      window.history.replaceState({}, "", url);

      // Toggle the playing state to show the iframe
      setIsPlaying(true);
    } catch (err) {
      console.error("Error starting game:", err);
    }
  };

  const handleCloseGame = () => {
    // Update URL parameter immediately (before state update)
    const url = new URL(window.location);
    url.searchParams.delete("playing");
    window.history.replaceState({}, "", url);

    // Update state
    setIsPlaying(false);
  };

  const handleIframeLoad = () => {
    setIsFrameLoading(false);
  };

  const toggleFullscreen = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    if (!document.fullscreenElement) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  const handleToggleFavorite = async () => {
    try {
      setIsAnimating(true); // Start animation

      if (isFavorite) {
        await userService.removeFromFavourites(id);
      } else {
        await userService.addToFavourites(id);
      }

      setIsFavorite(!isFavorite);

      // Reset animation state after animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 600);
    } catch (err) {
      console.error("Error toggling favorite status:", err);
      setIsAnimating(false);
    }
  };

  const handleGameUpdate = (updatedGame) => {
    setGame(updatedGame);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const url = new URL(window.location);
    if (isPlaying) {
      url.searchParams.set("playing", "true");
    } else {
      url.searchParams.delete("playing");
    }
    window.history.replaceState({}, "", url);
  }, [isPlaying]);

  // Game-themed decorative icons
  const decorativeIcons = [
    { icon: "🎮", size: 30, top: "5%", left: "3%", rotate: "-5deg", delay: 0 },
    {
      icon: "🏆",
      size: 25,
      top: "12%",
      right: "5%",
      rotate: "10deg",
      delay: 0.5,
    },
    {
      icon: "🎯",
      size: 22,
      bottom: "8%",
      left: "7%",
      rotate: "8deg",
      delay: 1,
    },
    {
      icon: "🎲",
      size: 28,
      bottom: "15%",
      right: "6%",
      rotate: "-8deg",
      delay: 1.5,
    },
  ];

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "calc(100vh - 64px)", // Adjust based on your header height
          width: "100%",
          background: "linear-gradient(135deg, #bbdefb 0%, #90caf9 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative elements */}
        {decorativeIcons.map((icon, index) => (
          <Typography
            key={index}
            component="div"
            sx={{
              position: "absolute",
              top: icon.top,
              left: icon.left,
              right: icon.right,
              bottom: icon.bottom,
              fontSize: icon.size,
              transform: `rotate(${icon.rotate})`,
              opacity: 0.3,
              animation: `float 5s ease-in-out infinite ${icon.delay}s`,
              "@keyframes float": {
                "0%, 100%": {
                  transform: `rotate(${icon.rotate}) translateY(0px)`,
                },
                "50%": {
                  transform: `rotate(${icon.rotate}) translateY(-15px)`,
                },
              },
            }}
          >
            {icon.icon}
          </Typography>
        ))}

        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            mb: 3,
            color: "#42a5f5",
          }}
        />
        <Typography
          sx={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: "1.5rem",
            color: "#424242",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Loading game details...
        </Typography>

        <SportsEsportsIcon
          sx={{
            fontSize: 40,
            color: "#ba68c8",
            animation: "pulse 1.5s infinite",
            mt: 2,
            "@keyframes pulse": {
              "0%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.2)" },
              "100%": { transform: "scale(1)" },
            },
          }}
        />
      </Box>
    );
  }

  if (error || !game) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "calc(100vh - 10px)",
          justifyContent: "center",
          width: "100%",
          background: "linear-gradient(135deg, #bbdefb 0%, #90caf9 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative elements */}
        {decorativeIcons.map((icon, index) => (
          <Typography
            key={index}
            component="div"
            sx={{
              position: "absolute",
              top: icon.top,
              left: icon.left,
              right: icon.right,
              bottom: icon.bottom,
              fontSize: icon.size,
              transform: `rotate(${icon.rotate})`,
              opacity: 0.3,
              animation: `float 5s ease-in-out infinite ${icon.delay}s`,
            }}
          >
            {icon.icon}
          </Typography>
        ))}

        <Box
          sx={{
            maxWidth: "800px",
            width: "100%",
            textAlign: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          <Typography
            variant="h5"
            color="error"
            sx={{
              fontFamily: "'Luckiest Guy', cursive",
              mb: 2,
            }}
          >
            {error || "Game not found"}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/games")}
            sx={{
              mt: 2,
              borderRadius: 28,
              px: 3,
              py: 1,
              zIndex: 2,
              fontFamily: "'Fredoka One', cursive",
              textTransform: "none",
              backgroundColor: "#42a5f5",
              "&:hover": {
                backgroundColor: "#1e88e5",
                transform: "scale(1.05)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Back to Games
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "calc(100vh - 10px)",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        px: { xs: 2, md: 4 },
        py: 1,
        background: "linear-gradient(135deg, #bbdefb 0%, #90caf9 100%)",
        position: "relative",
        transition: "opacity 0.5s ease",
        opacity: fontsLoaded ? 1 : 0,
      }}
    >
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
          pointerEvents: "none",
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
          pointerEvents: "none",
        }}
      />

      {/* header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 1,
          width: "100%",
          position: "relative",
          zIndex: 1,
          background: "rgba(255, 255, 255, 0.7)",
          borderRadius: 4,
          py: 1,
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontFamily: "'Luckiest Guy', cursive",
              color: "#42a5f5",
              letterSpacing: "1px",
              textShadow: "2px 2px 0px rgba(0,0,0,0.05)",
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate("/games")}
              sx={{
                mt: 2,
                borderRadius: 28,
                border: "1px solid #42a5f5",
                px: 3,
                py: 1,
                zIndex: 2,
                fontFamily: "'Fredoka One', cursive",
                textTransform: "none",
                backgroundColor: "transparent",
                position: "absolute",
                left: 30,
                top: 3,
                "&:hover": {
                  backgroundColor: "#ffcdd2",
                  transform: "scale(1.05)",
                  border: "1px solid #ffcdd2",
                },
              }}
            >
              Back to Games
            </Button>
            {game.title}
          </Typography>
          <IconButton
            onClick={handleToggleFavorite}
            color="error"
            size="small"
            className={
              isAnimating
                ? isFavorite
                  ? "heart-animation-grow"
                  : "heart-animation-shrink"
                : ""
            }
            sx={{
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            {isFavorite ? (
              <FavoriteIcon
                className={isAnimating ? "heart-fill-animation" : ""}
              />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontFamily: "'Bubblegum Sans', cursive",
            }}
          >
            Game by {game.creator}
          </Typography>
          <Avatar
            sx={{
              backgroundColor: "#f0f0f0",
              width: 20,
              height: 20,
              ml: 2,
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "rotate(360deg)",
              },
            }}
          >
            <GitHubIcon
              sx={{ color: "#333", fontSize: 12, width: 20, height: 20 }}
            />
          </Avatar>
          <Link
            href={game.creatorGithub}
            target="_blank"
            sx={{
              textDecoration: "none",
              color: "#ba68c8",
              fontSize: "0.8rem",
              fontFamily: "'Fredoka One', cursive",
              transition: "color 0.3s ease",
              "&:hover": {
                color: "#9c27b0",
              },
            }}
          >
            Github Profile
          </Link>
        </Box>
      </Box>

      {/* Main */}
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          width: "100%",
          gap: 2,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Game */}
        <Box
          sx={{
            width: { xs: "100%", md: "75%" },
            height: "100%",
            display: { xs: "block", md: "block" },
          }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: isPlaying ? "flex-start" : "center",
              alignItems: "center",
            }}
          >
            {isPlaying ? (
              <Paper
                elevation={3}
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "all 0.3s ease-in-out",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                  border: "4px solid rgba(255,255,255,0.6)",
                }}
              >
                {isFrameLoading && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      zIndex: 2,
                    }}
                  >
                    <CircularProgress
                      size={50}
                      sx={{
                        color: "#42a5f5",
                        mb: 2,
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "'Fredoka One', cursive",
                        fontSize: "1.2rem",
                        color: "#424242",
                      }}
                    >
                      Loading game...
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        mt: 2,
                        animation: "bounce 1.5s infinite",
                        "@keyframes bounce": {
                          "0%, 100%": { transform: "translateY(0)" },
                          "50%": { transform: "translateY(-10px)" },
                        },
                      }}
                    >
                      <VideogameAssetIcon sx={{ color: "#ffcdd2" }} />
                      <VideogameAssetIcon sx={{ color: "#ba68c8" }} />
                      <VideogameAssetIcon sx={{ color: "#42a5f5" }} />
                    </Box>
                  </Box>
                )}

                <IconButton
                  onClick={toggleFullscreen}
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    zIndex: 3,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  <FullscreenIcon sx={{ color: "#42a5f5" }} />
                </IconButton>

                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleCloseGame}
                  sx={{
                    position: "absolute",
                    bottom: 12,
                    right: 12,
                    zIndex: 3,
                    borderRadius: 28,
                    fontFamily: "'Fredoka One', cursive",
                    textTransform: "none",
                    boxShadow: "0 4px 10px rgba(186, 104, 200, 0.4)",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <CloseIcon />
                </Button>

                <iframe
                  ref={iframeRef}
                  src={gameUrl}
                  title={`Play ${game.title}`}
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={handleIframeLoad}
                ></iframe>
              </Paper>
            ) : (
              <Card
                sx={{
                  width: "80%",
                  maxWidth: "600px",
                  maxHeight: "400px",
                  borderRadius: 4,
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease-in-out",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  border: "4px solid rgba(255,255,255,0.4)",
                  position: "relative",
                  overflow: "hidden",
                  transform: "translateY(0)",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 15px 40px rgba(0, 0, 0, 0.2)",
                  },
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
                    display: "flex",
                    flexDirection: "column",
                    p: 3,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      fontFamily: "'Bubblegum Sans', cursive",
                      fontSize: "1.1rem",
                      color: "#424242",
                    }}
                  >
                    {game.description || "No description available"}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handlePlayGame}
                      size="large"
                      sx={{
                        minWidth: 200,
                        py: 1.5,
                        borderRadius: 28,
                        background: "linear-gradient(45deg, #42a5f5, #1976d2)",
                        fontFamily: "'Fredoka One', cursive",
                        fontSize: "1.1rem",
                        textTransform: "none",
                        boxShadow: "0 4px 15px rgba(66, 165, 245, 0.4)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 8px 25px rgba(66, 165, 245, 0.6)",
                        },
                      }}
                    >
                      Play Game
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>

        {/* Stats and Comments */}
        <Box
          sx={{
            width: { xs: "100%", md: "25%" },
            height: "100%",
            display: { xs: "none", md: "block" },
          }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {/* Game Stats */}
            <Box
              sx={{
                mb: 2,
                flexShrink: 0,
                width: "100%",
                "& > *": {
                  // Target the stats component
                  background: "rgba(255, 255, 255, 0.9) !important", // Override its background
                  borderRadius: "16px !important", // Make it rounded
                  boxShadow: "0 8px 20px rgba(0,0,0,0.1) !important", // Add shadow
                  backdropFilter: "blur(10px) !important", // Add blur effect
                  border: "3px solid rgba(255,255,255,0.4) !important", // Add border
                  transition: "all 0.3s ease !important", // Smooth transition
                  "&:hover": {
                    transform: "translateY(-5px) !important", // Lift on hover
                    boxShadow: "0 12px 30px rgba(0,0,0,0.15) !important", // Enhance shadow
                  },
                },
              }}
            >
              <GameStats
                game={{
                  ...game,
                  totalPlays:
                    game.analytics?.totalPlays || game.totalPlays || 0,
                }}
                user={user}
              />
            </Box>

            {/* Comments y Ratings */}
            <Box
              sx={{
                flexGrow: 1,
                overflow: "hidden",
                width: "100%",
                "& > *": {
                  // Target the comments component
                  background: "rgba(255, 255, 255, 0.9) !important", // Override its background
                  borderRadius: "16px !important", // Make it rounded
                  boxShadow: "0 8px 20px rgba(0,0,0,0.1) !important", // Add shadow
                  backdropFilter: "blur(10px) !important", // Add blur effect
                  border: "3px solid rgba(255,255,255,0.4) !important", // Add border
                },
              }}
            >
              <CommentsSection
                gameId={id}
                user={user}
                isLoggedIn={isLoggedIn}
                onGameUpdate={handleGameUpdate}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          "& .MuiAlert-root": {
            fontFamily: "'Bubblegum Sans', cursive",
            borderRadius: 4,
          },
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default GameDetailPage;
