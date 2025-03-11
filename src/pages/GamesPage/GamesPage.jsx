import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import gameService from "../../services/game.service";

import "./GamesPage.css";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  CircularProgress,
  Button,
  CardActions,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Grid2
} from "@mui/material";

function GamesPage() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("newest");
  const gamesPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    getGames();
  }, [sortOption]); // get games when sort option changes

  const getGames = async () => {
    try {
      setIsLoading(true);
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

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          flexDirection: "column",
        }}
      >
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>Loading games...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, p: 2, textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={handleRetry} sx={{ mr: 2 }}>
          Retry
        </Button>
        <Button variant="outlined" onClick={() => navigate("/home")}>
          Back to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header with navigation and title */}
      <Box
        sx={{
          mb: 3,
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        <Typography variant="h4" component="h1">
          Games Library
        </Typography>
      </Box>

      {/* Sort bar */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 3,
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          justifyContent: "flex-end",
          backgroundColor: "pink",
        }}
        id="sort-container"
        data-testid="sort-container"
      >
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="sort-select-label">Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            id="sort-select"
            value={sortOption}
            label="Sort By"
            onChange={handleSortChange}
            data-testid="sort-dropdown"
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
            <MenuItem value="nameAsc">Name (A-Z)</MenuItem>
            <MenuItem value="nameDesc">Name (Z-A)</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Game cards */}
      {games.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <Typography variant="h6" gutterBottom>
            No games available at the moment.
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
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
              <Grid2
                item
                xs={12}
                sm={6}
                md={4}
                key={game._id || game.id}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "350px",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 4,
                    },
                  }}
                  id={`game-card-${game._id || game.id}`}
                  data-testid={`game-card-${game._id || game.id}`}
                >
                  <CardActionArea
                    component={Link}
                    to={`/games/${game._id || game.id}`}
                    sx={{ flexGrow: 1 }}
                  >
                    <CardContent>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {game.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {game.description
                          ? game.description.substring(0, 50) + "..."
                          : "No description available"}
                      </Typography>
                      <Box
                        sx={{
                          width: "100%",
                          height: "100px",
                          maxHeight: "200px",
                          objectFit: "cover",
                          backgroundColor: "pink",
                        }}
                      />
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      component={Link}
                      to={`/games/${game._id || game.id}`}
                      fullWidth
                      id={`view-details-button-${game._id || game.id}`}
                      data-testid={`view-details-button-${game._id || game.id}`}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid2>
            ))}
          </Grid2>

          {/* Pagination */}
          {pageCount > 1 && (
            <Box
              sx={{ mt: 4, mb: 2, display: "flex", justifyContent: "center" }}
              id="pagination-container"
              data-testid="pagination-container"
            >
              <Pagination
                count={pageCount}
                page={page}
                onChange={handleChangePage}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                data-testid="games-pagination"
              />
            </Box>
          )}
        </>
      )}
      <Button
        variant="outlined"
        onClick={() => navigate("/home")}
        id="back-to-home-button"
        data-testid="back-to-home-button"
        sx={{ mt: 2 }}
      >
        Back to Home
      </Button>
    </Box>
  );
}

export default GamesPage;