// UserProfileDetails.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

function UserProfileDetails({
  user,
  playHistory,
  favoriteGames,
  onAdminDashboardClick,
}) {
  // Add local state to track the latest user data
  const [userData, setUserData] = useState(user);

  // Update local state whenever user prop changes
  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      // Try to create a date object
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "N/A";
      }

      // Format date: Month Day, Year
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "N/A";
    }
  };

  return (
    <Card sx={{ width: "100%", mb: 3, boxShadow: 2, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Account Details
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
          }}
        >
          <EmailIcon sx={{ mr: 1, color: "text.secondary" }} fontSize="small" />
          <Typography variant="body2">{userData.email}</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
          }}
        >
          <CalendarTodayIcon
            sx={{ mr: 1, color: "text.secondary" }}
            fontSize="small"
          />
          <Typography variant="body2">
            Member since: {formatDate(userData.createdAt)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
          }}
        >
          <AccessTimeIcon
            sx={{ mr: 1, color: "text.secondary" }}
            fontSize="small"
          />
          <Typography variant="body2">
            Last active: {formatDate(userData.stats?.lastActive)}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          Activity Statistics
        </Typography>

        <Box sx={{ mb: 1 }}>
          <Typography variant="body2">
            Games Played: {userData.stats?.gamesPlayed || 0}
          </Typography>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography variant="body2">
            Favorite Games: {favoriteGames.length}
          </Typography>
        </Box>

        {userData.role === "admin" && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              size="small"
              onClick={onAdminDashboardClick}
            >
              Admin Dashboard
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default UserProfileDetails;
