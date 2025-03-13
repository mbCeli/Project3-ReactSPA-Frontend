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
} from "@mui/material";

function HomePage() {
  const { isLoggedIn, user } = useContext(AuthContext);
  const [lastPlayedGame, setLastPlayedGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

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

  return (
    <Box
      sx={{
        py: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "1200px" }}>
        <Typography variant="h3" sx={{ mb: 3 }}>
          Home
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {isLoggedIn && user ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                }}
              >
                <Typography variant="h5" sx={{ mb: 0.5 }}>
                  Welcome{" "}
                  <span style={{ color: "orange" }}>{user.username}</span>
                </Typography>
                {user.isAdmin ? (
                  <>
                    <Typography variant="subtitle1" color="text.secondary">
                      You have admin privileges
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="subtitle1" color="text.secondary">
                      Time to have fun
                    </Typography>
                  </>
                )}
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h5">You are not logged in</Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/login")}
                size="medium"
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
                    boxShadow: 2,
                    borderRadius: 2,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 4,
                    },
                    flexGrow: 2,
                  }}
                >
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 4,
                    }}
                  >
                    <Typography
                      variant="h5"
                      component="h2"
                      gutterBottom
                      align="center"
                      sx={{ fontWeight: "bold", mb: 2 }}
                    >
                      Game Library
                    </Typography>
                    <Typography variant="body1" align="center" sx={{ mb: 3 }}>
                      Explore our collection of games and find your next
                      favorite!
                    </Typography>
                    <Box
                      variant="img"
                      sx={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        backgroundColor: "lightgrey",
                        borderRadius: 1,
                      }}
                    />
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      component={Link}
                      to="/games"
                      fullWidth
                      size="medium"
                      sx={{ py: 1 }}
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
                    boxShadow: 2,
                    borderRadius: 2,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 4,
                    },
                    flexGrow: 2,
                  }}
                >
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 4,
                    }}
                  >
                    <Typography
                      variant="h5"
                      component="h2"
                      gutterBottom
                      align="center"
                      sx={{ fontWeight: "bold", mb: 2 }}
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
                        <CircularProgress size={32} />
                      </Box>
                    ) : lastPlayedGame ? (
                      <Typography variant="body1" align="center" sx={{ mb: 3 }}>
                        Continue playing <strong>{lastPlayedGame.title}</strong>
                      </Typography>
                    ) : (
                      <Typography variant="body1" align="center" sx={{ mb: 3 }}>
                        You haven't played any games yet! What are you waiting
                        for?
                      </Typography>
                    )}
                    <Box
                      variant="img"
                      sx={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        backgroundColor: "black",
                        borderRadius: 1,
                      }}
                    />
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    {lastPlayedGame ? (
                      <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to={`/games/${lastPlayedGame._id}`}
                        fullWidth
                        size="medium"
                        sx={{ py: 1 }}
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
                        size="medium"
                        sx={{ py: 1 }}
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
  );
}

export default HomePage;
