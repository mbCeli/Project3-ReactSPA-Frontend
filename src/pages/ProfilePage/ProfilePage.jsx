import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import userService from "../../services/user.service";
import gameService from "../../services/game.service";
import analyticsService from "../../services/analytics.service";
import leaderboardService from "../../services/leaderboard.service";

import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Avatar,
  Grid2,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Paper,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";

function ProfilePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [playHistory, setPlayHistory] = useState([]);
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        // Fetch play history
        const historyResponse = await analyticsService.getUserPlayHistory();
        setPlayHistory(historyResponse.data);

        // Fetch favorite games
        const favoritesResponse = await gameService.getUserFavoriteGames();
        setFavoriteGames(
          Array.isArray(favoritesResponse) ? favoritesResponse : []
        );

        // Fetch achievements
        const achievementsResponse =
          await analyticsService.getUserAchievements();
        setAchievements(achievementsResponse.data);

        // Fetch ranks
        const ranksResponse = await leaderboardService.getUserRanks();
        setRanks(ranksResponse.data);

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Profile</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate("/home")}
          size="medium"
        >
          Back to Home
        </Button>
      </Box>

      <Grid2 container spacing={3}>
        {/* User Info Card */}
        <Grid2 item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 3,
              }}
            >
              <Avatar
                sx={{ width: 80, height: 80, mb: 2, bgcolor: "primary.main" }}
              >
                <PersonIcon fontSize="large" />
              </Avatar>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {user.username}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {user.fullName || ""}
              </Typography>
              <Divider sx={{ width: "100%", my: 2 }} />
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h6">{playHistory.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Games Played
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h6">{favoriteGames.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Favorites
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h6">
                    {user.stats?.highestScore || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Highest Score
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Account Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{user.email}</Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Member Since
                </Typography>
                <Typography variant="body1">
                  {new Date(user.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Last Active
                </Typography>
                <Typography variant="body1">
                  {user.stats?.lastActive
                    ? new Date(user.stats.lastActive).toLocaleDateString()
                    : "N/A"}
                </Typography>
              </Box>
              {user.isAdmin && (
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    Admin Dashboard
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid2>

        {/* Activity Tabs */}
        <Grid2 item xs={12} md={8}>
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab icon={<SportsEsportsIcon />} label="Play History" />
              <Tab icon={<FavoriteIcon />} label="Favorites" />
              <Tab icon={<EmojiEventsIcon />} label="Achievements" />
              <Tab icon={<StarIcon />} label="Rankings" />
            </Tabs>
          </Paper>

          {/* Tab Panels */}
          <Box sx={{ mb: 3 }}>
            {/* Play History */}
            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Recent Play History
                </Typography>
                {playHistory.length > 0 ? (
                  <List>
                    {playHistory.slice(0, 10).map((session) => (
                      <ListItem
                        key={session._id}
                        button
                        onClick={() => navigate(`/games/${session.game._id}`)}
                        sx={{
                          mb: 1,
                          border: "1px solid #eee",
                          borderRadius: 1,
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={session.game.thumbnail}
                            variant="rounded"
                            sx={{ bgcolor: "primary.light" }}
                          >
                            <SportsEsportsIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={session.game.title}
                          secondary={`Played on ${new Date(
                            session.playDate
                          ).toLocaleDateString()} • Score: ${session.score}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    You haven't played any games yet.
                  </Typography>
                )}
              </Box>
            )}

            {/* Favorites */}
            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Favorite Games
                </Typography>
                {favoriteGames.length > 0 ? (
                  <List>
                    {favoriteGames.map((game) => (
                      <ListItem
                        key={game._id}
                        button
                        onClick={() => navigate(`/games/${game._id}`)}
                        sx={{
                          mb: 1,
                          border: "1px solid #eee",
                          borderRadius: 1,
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={game.thumbnail}
                            variant="rounded"
                            sx={{ bgcolor: "primary.light" }}
                          >
                            <SportsEsportsIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={game.title}
                          secondary={`${game.category || "Game"}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    You don't have any favorite games yet.
                  </Typography>
                )}
              </Box>
            )}

            {/* Achievements */}
            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Your Achievements
                </Typography>
                {achievements.length > 0 ? (
                  <List>
                    {achievements.map((gameAchievement) => (
                      <Box key={gameAchievement.game._id} sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                          {gameAchievement.game.title}
                        </Typography>
                        <Grid2 container spacing={1}>
                          {gameAchievement.achievements.map(
                            (achievement, index) => (
                              <Grid2 item xs={6} sm={4} key={index}>
                                <Card
                                  variant="outlined"
                                  sx={{ height: "100%" }}
                                >
                                  <CardContent sx={{ p: 2 }}>
                                    <Typography variant="subtitle2">
                                      {achievement.achievement}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {achievement.description ||
                                        "Achievement unlocked"}
                                    </Typography>
                                  </CardContent>
                                </Card>
                              </Grid2>
                            )
                          )}
                        </Grid2>
                      </Box>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    You haven't earned any achievements yet.
                  </Typography>
                )}
              </Box>
            )}

            {/* Rankings */}
            {tabValue === 3 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Your Game Rankings
                </Typography>
                {ranks.length > 0 ? (
                  <List>
                    {ranks.map((rank) => (
                      <ListItem
                        key={rank.game._id}
                        button
                        onClick={() => navigate(`/games/${rank.game._id}`)}
                        sx={{
                          mb: 1,
                          border: "1px solid #eee",
                          borderRadius: 1,
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={rank.game.thumbnail}
                            variant="rounded"
                            sx={{ bgcolor: "primary.light" }}
                          >
                            <SportsEsportsIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={rank.game.title}
                          secondary={`Rank: ${rank.rank} of ${rank.totalPlayers} • Score: ${rank.score}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    You don't have any rankings yet.
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default ProfilePage;
