import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Button, Typography, Stack, Paper, Chip } from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

function LandingPage() {
  const navigate = useNavigate();
  const [selectedGameIndex, setSelectedGameIndex] = useState(2); // Initially select middle card
  const [fontsLoaded, setFontsLoaded] = useState(false);

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
      document.head.removeChild(link);
    };
  }, []);

  const gameCards = [
    {
      name: "Challenge",
      color: "#ffcdd2", // Using the custom soft pink from theme
      developer: "Puzzle Games",
      rating: "4.8",
      image:
        "https://images.unsplash.com/photo-1553481187-be93c21490a9?w=500&auto=format&fit=crop",
    },
    {
      name: "Arcade",
      color: "#f8bbd0", // Using the custom medium pink from theme
      developer: "Classic Fun",
      rating: "4.9",
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop",
    },
    {
      name: "Adventure",
      color: "#42a5f5", // Using the custom bright blue from theme
      developer: "Explore & Play",
      rating: "4.7",
      image:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&auto=format&fit=crop",
    },
    {
      name: "Strategy",
      color: "#ba68c8", // Using the custom soft purple from theme
      developer: "Test Your Mind",
      rating: "4.6",
      image:
        "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=500&auto=format&fit=crop",
    },
    {
      name: "Educational",
      color: "#66bb6a", // Green
      developer: "Learn & Play",
      rating: "4.5",
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&auto=format&fit=crop",
    },
  ];

  // Function to handle card rotation based on selected index
  const getCardStyles = (index) => {
    const isSelected = index === selectedGameIndex;
    const distanceFromSelected = Math.abs(selectedGameIndex - index);

    let rotation = 0;
    let translateY = 0;
    let scale = 1;
    let zIndex = 5;

    if (!isSelected) {
      rotation =
        index < selectedGameIndex
          ? 15 * distanceFromSelected
          : -15 * distanceFromSelected;
      translateY = 20 * distanceFromSelected;
      scale = 1 - 0.1 * distanceFromSelected;
      zIndex = 5 - distanceFromSelected;
    }

    return {
      transform: `perspective(1000px) rotateY(${rotation}deg) translateY(${translateY}px) scale(${scale})`,
      zIndex,
      transition: "all 0.5s ease-out",
      cursor: "pointer",
      opacity: scale,
    };
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        bgcolor: "#bbdefb", // Using the custom light blue as background
        color: "#212121",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Main content */}
      <Box
        sx={{
          pt: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          height: "calc(100vh - 120px)",
        }}
      >

        <Box>
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Luckiest Guy', cursive",
              color: "#42a5f5",
              textShadow: "3px 3px 0px rgba(0,0,0,0.1)",
              letterSpacing: "1px",
              mb: 1,
              opacity: fontsLoaded ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
          >
            Play with
          </Typography>
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Bubblegum Sans', cursive",
            color: "#ba68c8",
            mb: 3,
            fontWeight: 400,
            opacity: fontsLoaded ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        >
          FULP-Ironhack Las Palmas 2025
        </Typography>

        <Typography
          variant="body1"
          sx={{
            maxWidth: 800,
            mx: "auto",
            mb: 6,
            fontFamily: "'Fredoka One', cursive",
            fontSize: "1.1rem",
            color: "#424242",
            backgroundColor: "rgba(255,255,255,0.7)",
            padding: "15px 20px",
            borderRadius: "15px",
            opacity: fontsLoaded ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        >
          Discover amazing games built by talented full-stack development
          students. Challenge yourself, have fun, and see what's possible when
          creativity meets code!
        </Typography>

        {/* Game cards */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            perspective: 1000,
            height: 400,
          }}
        >
          {gameCards.map((game, index) => (
            <Paper
              key={game.name}
              elevation={24}
              onClick={() => setSelectedGameIndex(index)}
              sx={{
                width: 220,
                height: 320,
                borderRadius: "60px 60px 0 0",
                backgroundColor: game.color,
                position: "absolute",
                left: "calc(50% - 110px)",
                ...getCardStyles(index),
                overflow: "hidden",
                boxShadow:
                  index === selectedGameIndex
                    ? "0 20px 40px rgba(0,0,0,0.2)"
                    : "none",
              }}
            >
              <Box sx={{ p: 3, height: "100%", position: "relative" }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "'Fredoka One', cursive",
                      color: "white",
                      textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
                      opacity: fontsLoaded ? 1 : 0,
                      transition: "opacity 0.5s ease",
                    }}
                  >
                    {game.name}
                  </Typography>

                  <Chip
                    label={game.rating}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.4)",
                      color: "white",
                      height: 24,
                      "& .MuiChip-label": { px: 1 },
                    }}
                  />
                </Stack>

                <Typography
                  variant="body2"
                  color="white"
                  sx={{ opacity: 0.9, mb: 2 }}
                >
                  {game.developer}
                </Typography>

                {/* Game image */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -20,
                    right: -20,
                    width: 180,
                    height: 180,
                    borderRadius: "50%",
                    backgroundImage: `url(${game.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "drop-shadow(0 5px 5px rgba(0,0,0,0.3))",
                    border: "4px solid rgba(255,255,255,0.3)",
                  }}
                />
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Login/Signup buttons at the bottom */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          textAlign: "center",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255,255,255,0.8)",
        }}
      >
        <Stack direction="row" spacing={3} justifyContent="center">
          <Button
            variant="contained"
            onClick={() => navigate("/login")}
            sx={{
              borderRadius: 28,
              px: 5,
              py: 1,
              backgroundColor: "#42a5f5",
              "&:hover": {
                backgroundColor: "#1e88e5",
              },
              fontSize: "1rem",
              fontFamily: "'Fredoka One', cursive",
              boxShadow: "0 4px 10px rgba(66, 165, 245, 0.4)",
              opacity: fontsLoaded ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
          >
            Log In
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate("/signup")}
            sx={{
              borderRadius: 28,
              px: 5,
              py: 1.5,
              borderColor: "#ba68c8",
              color: "#ba68c8",
              borderWidth: 2,
              "&:hover": {
                borderColor: "#9c27b0",
                backgroundColor: "rgba(186, 104, 200, 0.08)",
                borderWidth: 2,
              },
              fontSize: "1rem",
              fontFamily: "'Fredoka One', cursive",
              opacity: fontsLoaded ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
          >
            Sign Up
          </Button>
        </Stack>
      </Box>

      {/* Decorative elements */}
      <Box
        sx={{
          position: "absolute",
          right: 40,
          bottom: 120,
          width: 120,
          height: 120,
          borderRadius: "50%",
          bgcolor: "rgba(255, 205, 210, 0.5)", // Soft pink with opacity
          filter: "blur(30px)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          left: 60,
          top: 140,
          width: 150,
          height: 150,
          borderRadius: "50%",
          bgcolor: "rgba(186, 104, 200, 0.4)", // Purple with opacity
          filter: "blur(40px)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "20%",
          width: 80,
          height: 80,
          borderRadius: "50%",
          bgcolor: "rgba(66, 165, 245, 0.3)", // Blue with opacity
          filter: "blur(25px)",
        }}
      />

      {/* Additional bubble decorations */}
      <Box
        sx={{
          position: "absolute",
          right: "15%",
          top: "15%",
          width: 40,
          height: 40,
          borderRadius: "50%",
          bgcolor: "#ffcdd2", // Soft pink
          opacity: 0.7,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          left: "20%",
          bottom: "25%",
          width: 25,
          height: 25,
          borderRadius: "50%",
          bgcolor: "#f8bbd0", // Medium pink
          opacity: 0.6,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          right: "25%",
          bottom: "30%",
          width: 35,
          height: 35,
          borderRadius: "50%",
          bgcolor: "#42a5f5", // Bright blue
          opacity: 0.5,
        }}
      />
    </Box>
  );
}

export default LandingPage;
