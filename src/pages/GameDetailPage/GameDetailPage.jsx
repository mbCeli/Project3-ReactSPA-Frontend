import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/Auth.context";
import gameService from "../../services/game.service";
import userService from "../../services/user.service";

import "./GameDetailPage.css";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Grid2,
  Paper,
  Link,
  Avatar,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseIcon from "@mui/icons-material/Close";
import GitHubIcon from "@mui/icons-material/GitHub";

// We'll use Material UI's own animation capabilities instead of framer-motion

function GameDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameUrl, setGameUrl] = useState("");
  const [isFrameLoading, setIsFrameLoading] = useState(true);
  const iframeRef = useRef(null);

  // Animation state for heart
  const [isAnimating, setIsAnimating] = useState(false);

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
      await gameService.postPlaySession(id, { userId: user._id });

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

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, p: 2 }}>
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!game) {
    return (
      <Box sx={{ mt: 4, p: 2 }}>
        <Typography variant="h5">Game not found</Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/games")}
          sx={{ mt: 2 }}
        >
          Back to Games
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {game.title}
          </Typography>
          <Typography>Game by {game.creator}</Typography>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 1 }}>
            <Avatar sx={{ backgroundColor: "pink" }}>
              <GitHubIcon />
            </Avatar>
            <Link href={game.creatorGithub} sx={{ pl: 1}}>{game.creator}'s Github Profile</Link>
          </Box>
        </Box>

        <Button
          variant="outlined"
          onClick={() => navigate("/games")}
          sx={{ marginLeft: "10px" }}
        >
          Back to Games
        </Button>
      </Box>

      <Grid2 container spacing={3}>
        {/* Main content area - takes more space */}
        <Grid2 item xs={12} md={9}>
          {isPlaying ? (
            <Box sx={{ mb: 3, position: "relative" }}>
              <Paper
                elevation={3}
                className="game-iframe-container"
                sx={{
                  width: "1600px",
                  height: "700px",
                  overflow: "hidden",
                  position: "relative",
                  mb: 2,
                  borderRadius: 2,
                }}
              >
                {isFrameLoading && (
                  <Box className="game-loading">
                    <CircularProgress />
                    <Typography variant="body1" sx={{ ml: 2 }}>
                      Loading game...
                    </Typography>
                  </Box>
                )}

                <IconButton
                  onClick={toggleFullscreen}
                  className="fullscreen-button"
                  sx={{ position: "absolute", top: 0, right: 800 }}
                >
                  <FullscreenIcon />
                </IconButton>

                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleCloseGame}
                  sx={{ position: "absolute", top: 0, right: 0 }}
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
                  className="game-iframe"
                ></iframe>
              </Paper>
            </Box>
          ) : (
            <Card sx={{ mb: 3, width: "1600px" }}>
              <CardContent>
                <Typography variant="body1">
                  {game.description || "No description available"}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mt: 3,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePlayGame}
                    size="large"
                    sx={{ minWidth: 200 }}
                  >
                    Play Game
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid2>

        {/* Sidebar for game stats - takes less space */}
        <Grid2 item xs={12} md={3} sx={{ marginLeft: "50px" }}>
          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <IconButton
                  onClick={handleToggleFavorite}
                  color="error"
                  size="large"
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
                      fontSize="large"
                      className={isAnimating ? "heart-fill-animation" : ""}
                    />
                  ) : (
                    <FavoriteBorderIcon fontSize="large" />
                  )}
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {isFavorite ? "Remove from favorites" : "Add to favorites"}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Your Best Score
              </Typography>
              <Typography variant="h5" color="primary">
                {user?.gameStats?.[id]?.bestScore || "-"}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Global Rating
              </Typography>
              <Typography variant="h5" color="primary">
                {game.rating?.averageScore?.toFixed(1) || "0"}/5
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({game.rating?.totalRatings || 0} ratings)
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default GameDetailPage;
