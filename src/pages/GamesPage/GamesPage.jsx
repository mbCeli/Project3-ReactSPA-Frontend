import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import gameService from "../../services/game.service";
import GameCardComponent from "../../components/games/GameCard/GameCard";

import "./GamesPage.css";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid2,
  Fade,
} from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import SortIcon from "@mui/icons-material/Sort";

function GamesPage() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("newest");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [animatedItems, setAnimatedItems] = useState([]);
  const gamesPerPage = 6;
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
    };
  }, []);

  const handleLogout = () => {
    console.log("logout button clicked");
    navigate("/logout");
  };

  useEffect(() => {
    getGames();
  }, [sortOption]); // get games when sort option changes

  // Animation for game cards appearing
  useEffect(() => {
    if (games.length > 0 && !isLoading) {
      const displayedGames = games.slice(
        (page - 1) * gamesPerPage,
        page * gamesPerPage
      );

      let timeout;
      const animateItems = [];

      displayedGames.forEach((game, index) => {
        timeout = setTimeout(() => {
          animateItems.push(game._id || game.id);
          setAnimatedItems([...animateItems]);
        }, 100 * (index + 1));
      });

      return () => clearTimeout(timeout);
    }
  }, [games, isLoading, page]);

  const getGames = async () => {
    try {
      setIsLoading(true);
      setAnimatedItems([]);
      const response = await gameService.getAllGames();
      let sortedGames = [...response.data];

      switch (sortOption) {
        case "newest":
          sortedGames.sort(
            (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          );
          break;
        case "oldest":
          sortedGames.sort(
            (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
          );
          break;
        case "nameAsc":
          sortedGames.sort((a, b) =>
            (a.title || "").localeCompare(b.title || "")
          );
          break;
        case "nameDesc":
          sortedGames.sort((a, b) =>
            (b.title || "").localeCompare(a.title || "")
          );
          break;
        default:
          // Default sorting by newest
          sortedGames.sort(
            (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          );
      }

      setGames(sortedGames);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching games:", err);
      setError("Failed to load games. Please try again later.");
      setIsLoading(false);
    }
  };

  //pagination
  const handleChangePage = (event, newPage) => {
    setAnimatedItems([]);
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleRetry = () => {
    setError(null);
    getGames();
  };

  // Calculate pagination
  const pageCount = Math.ceil(games.length / gamesPerPage);
  const displayedGames = games.slice(
    (page - 1) * gamesPerPage,
    page * gamesPerPage
  );

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
    { icon: "🎪", size: 24, top: "30%", right: "3%", rotate: "5deg", delay: 2 },
    {
      icon: "🧩",
      size: 26,
      top: "50%",
      left: "2%",
      rotate: "-3deg",
      delay: 2.5,
    },
    {
      icon: "🎨",
      size: 23,
      bottom: "40%",
      right: "4%",
      rotate: "7deg",
      delay: 3,
    },
  ];

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          flexDirection: "column",
          background: "linear-gradient(135deg, #bbdefb 0%, #90caf9 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
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
          Loading awesome games...
        </Typography>

        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <SportsEsportsIcon
            sx={{
              fontSize: 40,
              color: "#ba68c8",
              animation: "pulse 1.5s infinite",
              "@keyframes pulse": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.2)" },
                "100%": { transform: "scale(1)" },
              },
            }}
          />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          background: "linear-gradient(135deg, #bbdefb 0%, #90caf9 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          textAlign: "center",
          position: "relative",
        }}
      >
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
              opacity: 0.2,
              animation: `float 5s ease-in-out infinite ${icon.delay}s`,
            }}
          >
            {icon.icon}
          </Typography>
        ))}

        <Typography
          variant="h4"
          color="error"
          gutterBottom
          sx={{
            fontFamily: "'Luckiest Guy', cursive",
            mb: 2,
            position: "relative",
            zIndex: 2,
          }}
        >
          {error}
        </Typography>

        <Box sx={{ mt: 3, position: "relative", zIndex: 2 }}>
          <Button
            variant="contained"
            onClick={handleRetry}
            sx={{
              mr: 2,
              borderRadius: 28,
              px: 3,
              py: 1,
              fontFamily: "'Fredoka One', cursive",
              textTransform: "none",
              boxShadow: "0 4px 10px rgba(66, 165, 245, 0.4)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 6px 15px rgba(66, 165, 245, 0.5)",
              },
            }}
          >
            Retry
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/home")}
            sx={{
              borderRadius: 28,
              px: 3,
              py: 1,
              fontFamily: "'Fredoka One', cursive",
              textTransform: "none",
              borderColor: "#ba68c8",
              color: "#ba68c8",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "#9c27b0",
                backgroundColor: "rgba(186, 104, 200, 0.1)",
                transform: "translateY(-3px)",
              },
            }}
          >
            Back to Home
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #bbdefb 0%, #90caf9 100%)",
        position: "relative",
        overflow: "hidden",
        transition: "opacity 0.5s ease",
        opacity: fontsLoaded ? 1 : 0,
      }}
    >
      {/* Decorative elements */}
      {decorativeIcons.map((icon, index) => (
        <Typography
          key={index}
          component="div"
          sx={{
            position: "fixed", // Use fixed to keep them visible during scroll
            top: icon.top,
            left: icon.left,
            right: icon.right,
            bottom: icon.bottom,
            fontSize: icon.size,
            transform: `rotate(${icon.rotate})`,
            opacity: 0.3,
            animation: `float 5s ease-in-out infinite ${icon.delay}s`,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          {icon.icon}
        </Typography>
      ))}

      {/* Background circles */}
      <Box
        sx={{
          position: "fixed",
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
          position: "fixed",
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

      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            mb: 3,
            width: "100%",
            maxWidth: "1200px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontFamily: "'Luckiest Guy', cursive",
              color: "#42a5f5",
              textShadow: "3px 3px 0px rgba(0,0,0,0.1)",
              letterSpacing: "1px",
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              mr: 2,
            }}
          >
            <SportsEsportsIcon
              sx={{
                fontSize: 40,
                animation: "bounce 2s infinite",
                "@keyframes bounce": {
                  "0%, 100%": { transform: "translateY(0)" },
                  "50%": { transform: "translateY(-10px)" },
                },
              }}
            />
            Games Library
          </Typography>

          {/* Sort dropdown in a container with effects */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              borderRadius: 4,
              p: 1,
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <SortIcon
              sx={{
                mr: 1,
                fontSize: 24,
                color: "#424242",
                animation: "rotate 10s linear infinite",
                "@keyframes rotate": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
                },
              }}
            />
            <FormControl
              variant="standard"
              sx={{ minWidth: 120, height: "35px" }}
            >
              <InputLabel
                sx={{
                  fontFamily: "'Fredoka One', cursive",
                  color: "#424242",
                }}
              >
                Sort By
              </InputLabel>
              <Select
                labelId="sort-select-label"
                id="sort-select"
                value={sortOption}
                label="Sort By"
                onChange={handleSortChange}
                data-testid="sort-dropdown"
                size="small"
                sx={{
                  fontFamily: "'Bubblegum Sans', cursive",
                  "&:before, &:after": {
                    borderColor: "#ba68c8",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#ba68c8",
                  },
                }}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="nameAsc">Name (A-Z)</MenuItem>
                <MenuItem value="nameDesc">Name (Z-A)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Game cards */}
        {games.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 5,
              background: "rgba(255, 255, 255, 0.7)",
              borderRadius: 4,
              p: 4,
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              maxWidth: "800px",
              width: "100%",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontFamily: "'Luckiest Guy', cursive",
                color: "#ba68c8",
              }}
            >
              No games available at the moment.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                fontFamily: "'Bubblegum Sans', cursive",
                fontSize: "1.1rem",
              }}
            >
              Check back later for new games.
            </Typography>
          </Box>
        ) : (
          <>
            <Grid2
              container
              spacing={3}
              sx={{
                justifyContent: "center",
                width: "100%",
                maxWidth: "1200px",
              }}
              id="games-grid"
              data-testid="games-grid"
            >
              {displayedGames.map((game) => (
                <Fade
                  in={animatedItems.includes(game._id || game.id)}
                  timeout={500}
                  key={game._id || game.id}
                >
                  <Grid2
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      className="game-card-wrapper"
                      sx={{
                        transform: "translateY(0)",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-10px)",
                        },
                      }}
                    >
                      <GameCardComponent game={game} />
                    </Box>
                  </Grid2>
                </Fade>
              ))}
            </Grid2>

            {/* Pagination */}
            {pageCount > 1 && (
              <Box
                sx={{
                  mt: 4,
                  mb: 3,
                  display: "flex",
                  justifyContent: "center",
                  background: "rgba(255, 255, 255, 0.7)",
                  borderRadius: 4,
                  py: 2,
                  px: 3,
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
                id="pagination-container"
                data-testid="pagination-container"
              >
                <Pagination
                  count={pageCount}
                  page={page}
                  color="secondary"
                  size="large"
                  variant="outlined"
                  showFirstButton
                  showLastButton
                  data-testid="games-pagination"
                  onChange={handleChangePage}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      fontFamily: "'Fredoka One', cursive",
                      color: "#424242",
                      borderColor: "#ba68c8",
                      margin: "0 2px",
                      "&.Mui-selected": {
                        backgroundColor: "#ba68c8",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#9c27b0",
                        },
                      },
                      "&:hover": {
                        backgroundColor: "rgba(186, 104, 200, 0.1)",
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

export default GamesPage;
