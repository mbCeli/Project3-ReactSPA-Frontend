import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import analyticsService from "../../../services/analytics.service";
import gameService from "../../../services/game.service";
import userService from "../../../services/user.service";
import leaderboardService from "../../../services/leaderboard.service";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";

import GamesIcon from "@mui/icons-material/Games";
import PeopleIcon from "@mui/icons-material/People";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import BarChartIcon from "@mui/icons-material/BarChart";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import GamepadIcon from "@mui/icons-material/Gamepad";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

function DashboardPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState(30);
  const [platformAnalytics, setPlatformAnalytics] = useState(null);
  const [popularGames, setPopularGames] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [gameCount, setGameCount] = useState(0);
  const [topUsers, setTopUsers] = useState([]);
  const [recentGames, setRecentGames] = useState([]);
  const [recentlyActiveUsers, setRecentlyActiveUsers] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, [timeRange]);

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);

      // Fetch platform analytics data
      const analyticsResponse = await analyticsService.getPlatformAnalytics(
        timeRange
      );
      setPlatformAnalytics(analyticsResponse.data);

      if (analyticsResponse.data.popularGames) {
        setPopularGames(analyticsResponse.data.popularGames);
      }

      // Fetch user and game counts
      const usersResponse = await userService.getAllUsers();
      setUserCount(usersResponse.data.length);

      // Sort users by last active and take the 5 most recent
      const sortedUsers = [...usersResponse.data].sort((a, b) => {
        const dateA = a.stats?.lastActive
          ? new Date(a.stats.lastActive)
          : new Date(0);
        const dateB = b.stats?.lastActive
          ? new Date(b.stats.lastActive)
          : new Date(0);
        return dateB - dateA;
      });

      setRecentlyActiveUsers(sortedUsers.slice(0, 5));

      // Fetch games
      const gamesResponse = await gameService.getAllGames();
      setGameCount(gamesResponse.data.length);

      // Sort games by creation date and take the 5 most recent
      const sortedGames = [...gamesResponse.data].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
      });

      setRecentGames(sortedGames.slice(0, 5));

      // Fetch global rankings for top users
      const rankingsResponse = await leaderboardService.getGlobalRankings(5);
      setTopUsers(rankingsResponse.data);

      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError("Failed to load admin dashboard data. Please try again later.");
      setIsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    await fetchAdminData();
    setIsRefreshing(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time elapsed for display
  const getTimeElapsed = (dateString) => {
    if (!dateString) return "Never";

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "80vh",
        }}
      >
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography>Loading dashboard data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => fetchAdminData()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        width: "calc(100% - 120px)",
        marginLeft: "200px",
        maxWidth: "1200px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Admin Dashboard</Typography>
        <Box>
          <Tooltip title="Refresh Data">
            <IconButton
              onClick={handleRefreshData}
              disabled={isRefreshing}
              sx={{ mr: 2 }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/games")}
            sx={{ mr: 2 }}
            startIcon={<GamesIcon />}
          >
            Manage Games
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/users")}
            sx={{ mr: 2 }}
            startIcon={<PeopleIcon />}
          >
            Manage Users
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/home")}
            id="back-to-home-button"
            data-testid="back-to-home-button"
            size="medium"
          >
            Back to Home
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%", boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <GamesIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Games</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {gameCount}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate("/admin/games")}
                  startIcon={<EditIcon />}
                >
                  Manage
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%", boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PeopleIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Users</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {userCount}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate("/admin/users")}
                  startIcon={<EditIcon />}
                >
                  Manage
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%", boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <QueryStatsIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Active Users</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {platformAnalytics?.activeUsers || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last {timeRange} days
              </Typography>
              <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  {`${
                    Math.round(
                      (platformAnalytics?.activeUsers / userCount) * 100
                    ) || 0
                  }% of total`}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={
                    (platformAnalytics?.activeUsers / userCount) * 100 || 0
                  }
                  sx={{ flexGrow: 1 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%", boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <GamepadIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Plays</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {platformAnalytics?.totalPlays || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last {timeRange} days
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">
                  {`~${
                    platformAnalytics?.averageDailyPlays || 0
                  } plays per day`}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Time Range Selector */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={handleTimeRangeChange}
          >
            <MenuItem value={7}>Last 7 Days</MenuItem>
            <MenuItem value={30}>Last 30 Days</MenuItem>
            <MenuItem value={90}>Last 3 Months</MenuItem>
            <MenuItem value={180}>Last 6 Months</MenuItem>
            <MenuItem value={365}>Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Detailed Analytics Tabs */}
      <Paper sx={{ mb: 3, boxShadow: 3, borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab icon={<GamesIcon />} label="Games" />
          <Tab icon={<PeopleIcon />} label="Users" />
          <Tab icon={<EmojiEventsIcon />} label="Leaderboard" />
          <Tab icon={<BarChartIcon />} label="Analytics" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Most Popular Games</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate("/admin/games")}
                >
                  View All Games
                </Button>
              </Box>

              <TableContainer component={Paper} sx={{ mb: 3, boxShadow: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Rank</TableCell>
                      <TableCell>Game</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="center">Play Count</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {popularGames.length > 0 ? (
                      popularGames.map((game, index) => (
                        <TableRow key={game.gameId || index}>
                          <TableCell>
                            <Chip
                              label={index + 1}
                              size="small"
                              color={index < 3 ? "primary" : "default"}
                            />
                          </TableCell>
                          <TableCell>{game.title}</TableCell>
                          <TableCell>{game.category || "N/A"}</TableCell>
                          <TableCell align="center">{game.playCount}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="View Game">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  navigate(`/games/${game.gameId}`)
                                }
                              >
                                <OpenInNewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No play data available for this time period
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Recently Added Games
                </Typography>
                <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Game</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Creator</TableCell>
                        <TableCell align="center">Added On</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentGames.length > 0 ? (
                        recentGames.map((game) => (
                          <TableRow key={game._id}>
                            <TableCell>{game.title}</TableCell>
                            <TableCell>{game.category}</TableCell>
                            <TableCell>{game.creator}</TableCell>
                            <TableCell align="center">
                              {formatDate(game.createdAt)}
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="View Game">
                                <IconButton
                                  size="small"
                                  onClick={() => navigate(`/games/${game._id}`)}
                                >
                                  <OpenInNewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit Game">
                                <IconButton
                                  size="small"
                                  onClick={() => navigate(`/admin/games`)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            No recent games
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Recently Active Users</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate("/admin/users")}
                >
                  View All Users
                </Button>
              </Box>

              <TableContainer component={Paper} sx={{ mb: 3, boxShadow: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell align="center">Games Played</TableCell>
                      <TableCell align="center">Last Active</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentlyActiveUsers.length > 0 ? (
                      recentlyActiveUsers.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar
                                src={user.profilePicture}
                                alt={user.username}
                                sx={{ width: 24, height: 24, mr: 1 }}
                              />
                              {user.username}
                            </Box>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Chip
                              label={user.role}
                              size="small"
                              color={
                                user.role === "admin" ? "secondary" : "default"
                              }
                            />
                          </TableCell>
                          <TableCell align="center">
                            {user.stats?.gamesPlayed || 0}
                          </TableCell>
                          <TableCell align="center">
                            {getTimeElapsed(user.stats?.lastActive)}
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Edit User">
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/admin/users`)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No recent user activity
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  User Activity Summary
                </Typography>
                <Paper sx={{ p: 2, boxShadow: 2 }}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Active Users: {platformAnalytics?.activeUsers || 0} out of{" "}
                    {userCount} total users (
                    {Math.round(
                      (platformAnalytics?.activeUsers / userCount) * 100
                    ) || 0}
                    %)
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Average Daily Plays:{" "}
                    {platformAnalytics?.averageDailyPlays || 0}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Average Plays Per User:{" "}
                    {Math.round(
                      (platformAnalytics?.totalPlays || 0) /
                        (platformAnalytics?.activeUsers || 1)
                    )}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      variant="contained"
                      onClick={() => navigate("/admin/users")}
                    >
                      Manage Users
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Global Leaderboard Rankings
              </Typography>

              <TableContainer component={Paper} sx={{ mb: 3, boxShadow: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Rank</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Total Score</TableCell>
                      <TableCell>Games Ranked</TableCell>
                      <TableCell>Highest Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topUsers.length > 0 ? (
                      topUsers.map((user, index) => (
                        <TableRow key={user.userId || index}>
                          <TableCell>
                            {index === 0 ? (
                              <Chip
                                icon={<EmojiEventsIcon />}
                                label="1st"
                                color="warning"
                                size="small"
                              />
                            ) : index === 1 ? (
                              <Chip
                                label="2nd"
                                color="secondary"
                                size="small"
                              />
                            ) : index === 2 ? (
                              <Chip label="3rd" color="primary" size="small" />
                            ) : (
                              <Chip label={`${index + 1}th`} size="small" />
                            )}
                          </TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>
                            {user.totalScore.toLocaleString()}
                          </TableCell>
                          <TableCell>{user.gamesRanked}</TableCell>
                          <TableCell>
                            {user.highestScore.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No leaderboard data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/leaderboard")}
                  startIcon={<OpenInNewIcon />}
                >
                  View Full Leaderboard
                </Button>
              </Box>
            </Box>
          )}

          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Platform Analytics
              </Typography>
              <Box sx={{ mb: 4 }}>
                <Paper sx={{ p: 3, boxShadow: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Game Play Distribution
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Game Category Distribution
                          </Typography>
                          <Box
                            sx={{
                              mt: 2,
                              height: 200,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Detailed charts will be implemented in future
                              updates
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Game Difficulty Distribution
                          </Typography>
                          <Box
                            sx={{
                              mt: 2,
                              height: 200,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Detailed charts will be implemented in future
                              updates
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  <Typography variant="subtitle1" gutterBottom>
                    User Demographics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Age Distribution
                          </Typography>
                          <Box
                            sx={{
                              mt: 2,
                              height: 200,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Detailed charts will be implemented in future
                              updates
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Device Usage
                          </Typography>
                          <Box
                            sx={{
                              mt: 2,
                              height: 200,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Detailed charts will be implemented in future
                              updates
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default DashboardPage;
