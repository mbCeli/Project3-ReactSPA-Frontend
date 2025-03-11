import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/Auth.context";
import gameService from "../../services/game.service";
import userService from "../../services/user.service";

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
          //necesito get the play history para saber cual es the last game played
          const historyResponse = await userService.getPlayHistory();

          if (historyResponse.data && historyResponse.data.length > 0) {
            // Sort by date and get the most recent
            const sortedHistory = [...historyResponse.data].sort(
              (a, b) => new Date(b.playedAt) - new Date(a.playedAt)
            );

            if (sortedHistory[0] && sortedHistory[0].gameId) {
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

  const handleLogout = () => {
    console.log("logout button clicked");
    navigate("/logout");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h2" sx={{ mb: 4 }}>
        Home page
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        {isLoggedIn && user ? (
          <>
            <Typography variant="h4" sx={{ margin: "10px" }}>
              Welcome {user.username}
            </Typography>
            <Typography variant="h5" sx={{ margin: "10px" }}>
              {user.isAdmin ? "You have admin privileges" : ""}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h4">You are not logged in</Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/login")}
            >
              Log In
            </Button>
          </>
        )}
      </Box>

      {isLoggedIn && (
        <Box
          sx={{
            mt: 4,
            height: "calc(100vh - 250px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <Grid2 container spacing={4} sx={{ flexGrow: 1 }}>
            {/* Game Library Card */}
            <Grid2 item xs={12} md={6} sx={{ display: "flex" }}>
              <Card
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 3,
                  borderRadius: 2,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 5,
                  }}
                >
                  <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    align="center"
                    sx={{ fontWeight: "bold", mb: 3 }}
                  >
                    Game Library
                  </Typography>
                  <Typography variant="h6" align="center" sx={{ mb: 4 }}>
                    Explore our collection of games and find your next favorite!
                  </Typography>
                  <Box
                    variant="img"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      backgroundColor: "lightgrey",
                    }}
                  />
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/games"
                    fullWidth
                    size="large"
                    sx={{ py: 1.5, fontSize: "1.1rem" }}
                  >
                    Browse Games
                  </Button>
                </CardActions>
              </Card>
            </Grid2>

            {/* Last Played Game Card */}
            <Grid2 item xs={12} md={6} sx={{ display: "flex" }}>
              <Card
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 3,
                  borderRadius: 2,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 5,
                  }}
                >
                  <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    align="center"
                    sx={{ fontWeight: "bold", mb: 3 }}
                  >
                    Last Played Game
                  </Typography>

                  {isLoading ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 4 }}
                    >
                      <CircularProgress size={40} />
                    </Box>
                  ) : lastPlayedGame ? (
                    <Typography variant="h6" align="center" sx={{ mb: 4 }}>
                      Continue playing <strong>{lastPlayedGame.title}</strong>
                    </Typography>
                  ) : (
                    <Typography variant="h6" align="center" sx={{ mb: 4 }}>
                      You haven't played any games yet. Check out our game
                      library!
                    </Typography>
                  )}
                  <Box
                    variant="img"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      backgroundColor: "black",
                    }}
                  />
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  {lastPlayedGame ? (
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to={`/games/${lastPlayedGame._id}`}
                      fullWidth
                      size="large"
                      sx={{ py: 1.5, fontSize: "1.1rem" }}
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
                      sx={{ py: 1.5, fontSize: "1.1rem" }}
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
  );
}

export default HomePage;
