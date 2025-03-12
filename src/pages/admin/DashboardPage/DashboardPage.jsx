import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import analyticsService from "../../../services/analytics.service";
import gameService from "../../../services/game.service";
import userService from "../../../services/user.service";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid2,
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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";

import GamesIcon from "@mui/icons-material/Games";
import PeopleIcon from "@mui/icons-material/People";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import TimelineIcon from "@mui/icons-material/Timeline";

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

  useEffect(() => {
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

        const gamesResponse = await gameService.getAllGames();
        setGameCount(gamesResponse.data.length);

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError(
          "Failed to load admin dashboard data. Please try again later."
        );
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [timeRange]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
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
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/games")}
            sx={{ mr: 2 }}
          >
            Manage Games
          </Button>
          <Button variant="outlined" onClick={() => navigate("/admin/users")}>
            Manage Users
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/home")}
            id="back-to-home-button"
            data-testid="back-to-home-button"
            size="medium"
            sx={{ ml: 2 }}
          >
            Back to Home
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid2 container spacing={3} sx={{ mb: 3 }}>
        <Grid2 item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <GamesIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Games</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {gameCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PeopleIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Users</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {userCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 item xs={12} sm={6} md={3}>
          <Card>
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
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TimelineIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Plays</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {platformAnalytics?.totalPlays || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last {timeRange} days
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

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
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Popular Games" />
          <Tab label="User Activity" />
          <Tab label="Analytics" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Most Popular Games
              </Typography>
              <List>
                {popularGames.length > 0 ? (
                  popularGames.map((game, index) => (
                    <ListItem
                      key={game.gameId || index}
                      divider={index < popularGames.length - 1}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          {index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={game.title}
                        secondary={`Category: ${game.category || "N/A"}`}
                      />
                      <Box>
                        <Typography variant="h6">{game.playCount}</Typography>
                        <Typography variant="caption">plays</Typography>
                      </Box>
                    </ListItem>
                  ))
                ) : (
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ py: 2, textAlign: "center" }}
                  >
                    No play data available for this time period.
                  </Typography>
                )}
              </List>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/admin/games")}
                >
                  Manage All Games
                </Button>
              </Box>
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                User Activity Summary
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Active Users: {platformAnalytics?.activeUsers || 0} out of{" "}
                {userCount} total users
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Average Daily Plays: {platformAnalytics?.averageDailyPlays || 0}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/admin/users")}
                >
                  Manage Users
                </Button>
              </Box>
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Platform Analytics
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                More detailed analytics coming soon...
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                This section will include charts for daily activity, user
                engagement metrics, and platform growth over time.
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default DashboardPage;
