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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function GameDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const iframeRef = useRef(null);

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

      // Toggle the playing state to show the iframe
      setIsPlaying(true);
    } catch (err) {
      console.error("Error starting game:", err);
    }
  };

  const handleCloseGame = () => {
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

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 64px)", // Adjust based on your header height
          width: "100%",
        }}
      >
        <CircularProgress size={40} />
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
        }}
      >
        <Box sx={{ maxWidth: "800px", width: "100%", textAlign: "center" }}>
          <Typography variant="h5" color="error">
            {error || "Game not found"}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/games")}
            sx={{ mt: 2 }}
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
      }}
    >
      {/* header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 1,
          width: "100%",
          position: "relative",
        }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate("/games")}
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            fontSize: "0.7rem",
            py: 0.5,
            px: 1,
          }}
        >
          <ArrowBackIcon size="small" />
          Back to Games
        </Button>

        {/* Title with favorite button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h5" component="h1">
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

        <Box sx={{ display: "flex", alignItems: "center", gap: 1}}>
          <Typography variant="subtitle1">Game by {game.creator}</Typography>
          <Avatar sx={{ backgroundColor: "#f0f0f0", width: 20, height: 20, ml:2 }}>
            <GitHubIcon
              sx={{ color: "#333", fontSize: 12, width: 20, height: 20 }}
            />
          </Avatar>
          <Link
            href={game.creatorGithub}
            target="_blank"
            sx={{
              textDecoration: "none",
              color: "#333",
              fontSize: "0.8rem",
            }}
          >
            Github Profile
          </Link>
        </Box>
      </Box>

      {/* Main */}
      <Box sx={{ display: "flex", flexGrow: 1, width: "100%", gap: 2 }}>
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
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      zIndex: 2,
                    }}
                  >
                    <CircularProgress />
                    <Typography variant="body1" sx={{ ml: 2 }}>
                      Loading game...
                    </Typography>
                  </Box>
                )}

                <IconButton
                  onClick={toggleFullscreen}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    zIndex: 3,
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    },
                  }}
                >
                  <FullscreenIcon />
                </IconButton>

                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleCloseGame}
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                    zIndex: 3,
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
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease-in-out",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                }}
              >
                <CardContent
                  sx={{ display: "flex", flexDirection: "column", p: 3 }}
                >
                  <Typography variant="body1" sx={{ mb: 3 }}>
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
                      sx={{ minWidth: 200, py: 1.5 }}
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
            <Box sx={{ mb: 2, flexShrink: 0 }}>
              <GameStats game={game} user={user} />
            </Box>

            {/* Comments y Ratings */}
            <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
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
