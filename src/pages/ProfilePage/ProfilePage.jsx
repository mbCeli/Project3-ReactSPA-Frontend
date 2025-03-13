import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import userService from "../../services/user.service";
import gameService from "../../services/game.service";
import analyticsService from "../../services/analytics.service";

import UserProfileHeader from "../../components/user/UserProfileHeader/UserProfileHeader";
import UserProfileDetails from "../../components/user/UserProfileDetails/UserProfileDetails";
import EditProfileDialog from "../../components/user/EditProfileDialog/EditProfileDialog";
import PlayHistoryList from "../../components/analytics/PlayHistoryList/PlayHistoryList";
import AchievementsList from "../../components/analytics/AchievementsList/AchievementsList";
import FavouriteGamesList from "../../components/user/FavouriteGamesList/FavouriteGamesList";
import UserRankingsList from "../../components/leaderboard/UserRankingsList/UserRankingsList";

import "./ProfilePage.css";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";

import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

function ProfilePage() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [playHistory, setPlayHistory] = useState([]);
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Edit profile states
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        // Fetch play history with error handling
        try {
          const historyResponse = await analyticsService.getUserPlayHistory();
          setPlayHistory(
            Array.isArray(historyResponse.data) ? historyResponse.data : []
          );
        } catch (historyError) {
          console.error("Error fetching play history:", historyError);
          setPlayHistory([]);
        }

        // Fetch favorite games with error handling
        try {
          const favouritesResponse = await gameService.getUserFavouriteGames();
          console.log("Favourites response:", favouritesResponse);
          setFavoriteGames(
            Array.isArray(favouritesResponse) ? favouritesResponse : []
          );
        } catch (favError) {
          console.error("Error fetching favorites:", favError);
          setFavoriteGames([]);
        }

        // Fetch achievements (placeholder for now)
        setAchievements([]);

        // Fetch ranks (placeholder for now)
        setRanks([]);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    } else {
      setIsLoading(false);
      setHasError(true);
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditOpen = () => {
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
  };

  // Function to handle profile update
  const handleSaveProfile = async (userData) => {
    try {
      // Update the user in the database
      await userService.updateUser(user._id, userData);

      handleEditClose();
      setSnackbar({
        open: true,
        message: "Profile updated successfully! Refreshing...",
        severity: "success",
      });

      // Give the snackbar a moment to show
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
      setSnackbar({
        open: true,
        message: `Failed to update profile: ${error.message}`,
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (hasError || !user) {
    return (
      <Box sx={{ textAlign: "center", py: 5 }}>
        <Typography variant="h6" color="error" gutterBottom>
          There was a problem loading your profile
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Box
        sx={{
          p: 3,
          width: "100%", // Take full width
          maxWidth: "100%", // Use entire available width
          paddingLeft: { xs: "20px", sm: "120px" }, // Space for sidebar
          paddingRight: "20px",
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
          <Typography
            variant="h4"
            component={motion.h1}
            variants={itemVariants}
          >
            Profile
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: "100%",
            gap: 4,
          }}
        >
          {/* User Info and Account Details Column - Fixed width */}
          <Box
            sx={{
              width: { xs: "100%", md: "350px" },
              flexShrink: 0,
            }}
            component={motion.div}
            variants={itemVariants}
          >
            {/* User Profile Header with Avatar, Name, Edit Button */}
            <UserProfileHeader user={user} onEditClick={handleEditOpen} />

            {/* User Details Card */}
            <UserProfileDetails
              user={user}
              playHistory={playHistory}
              favoriteGames={favoriteGames}
              onAdminDashboardClick={() => navigate("/admin/dashboard")}
            />
          </Box>

          {/* Activity Content - Takes remaining space */}
          <Box
            sx={{
              flexGrow: 1,
              width: { xs: "100%", md: "calc(100% - 350px - 32px)" },
            }}
            component={motion.div}
            variants={itemVariants}
          >
            <Paper
              sx={{ mb: 3, borderRadius: 3, overflow: "hidden", width: "100%" }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
                sx={{ minHeight: "64px" }} // Taller tabs for better visibility
              >
                <Tab icon={<SportsEsportsIcon />} label="Play History" />
                <Tab icon={<FavoriteIcon />} label="Favorites" />
                <Tab icon={<EmojiEventsIcon />} label="Achievements" />
                <Tab icon={<StarIcon />} label="Rankings" />
              </Tabs>
            </Paper>

            {/* Tab Panels */}
            <Box
              sx={{ mb: 3, width: "100%" }}
              component={motion.div}
              variants={itemVariants}
            >
              {/* Play History Tab */}
              {tabValue === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6">Recent Play History</Typography>
                    <Chip
                      icon={<TrendingUpIcon />}
                      label={`${playHistory.length} Total Sessions`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>

                  <PlayHistoryList
                    playHistory={playHistory}
                    onGameClick={(gameId) => navigate(`/games/${gameId}`)}
                    emptyAction={
                      <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => navigate("/games")}
                      >
                        Find Games to Play
                      </Button>
                    }
                  />
                </motion.div>
              )}

              {/* Favorites Tab */}
              {tabValue === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6">Favorite Games</Typography>
                    <Chip
                      icon={<FavoriteIcon />}
                      label={`${favoriteGames.length} Games`}
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  </Box>

                  <FavouriteGamesList
                    games={favoriteGames}
                    onGameClick={(gameId) => navigate(`/games/${gameId}`)}
                    emptyAction={
                      <Button
                        variant="contained"
                        color="error"
                        sx={{ mt: 2 }}
                        onClick={() => navigate("/games")}
                      >
                        Find Games to Like
                      </Button>
                    }
                  />
                </motion.div>
              )}

              {/* Achievements Tab */}
              {tabValue === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6">Your Achievements</Typography>
                    <Chip
                      icon={<EmojiEventsIcon />}
                      label={
                        achievements.reduce(
                          (acc, curr) => acc + (curr.achievements?.length || 0),
                          0
                        ) + " Achievements"
                      }
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  </Box>

                  <AchievementsList
                    gameAchievements={achievements}
                    emptyAction={
                      <Button
                        variant="contained"
                        color="warning"
                        sx={{ mt: 2 }}
                        onClick={() => navigate("/games")}
                      >
                        Go Earn Achievements
                      </Button>
                    }
                  />
                </motion.div>
              )}

              {/* Rankings Tab */}
              {tabValue === 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6">Your Game Rankings</Typography>
                    <Chip
                      icon={<StarIcon />}
                      label={`${ranks.length} Games Ranked`}
                      size="small"
                      color="info"
                      variant="outlined"
                    />
                  </Box>

                  <UserRankingsList
                    rankings={ranks}
                    onGameClick={(gameId) => navigate(`/games/${gameId}`)}
                    emptyAction={
                      <Button
                        variant="contained"
                        color="info"
                        sx={{ mt: 2 }}
                        onClick={() => navigate("/games")}
                      >
                        Get on the Leaderboards
                      </Button>
                    }
                  />
                </motion.div>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        open={openEditDialog}
        user={user}
        onClose={handleEditClose}
        onSave={handleSaveProfile}
      />

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
    </motion.div>
  );
}

export default ProfilePage;
