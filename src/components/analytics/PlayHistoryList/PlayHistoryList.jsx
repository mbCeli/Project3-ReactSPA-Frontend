import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Box,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { motion } from "framer-motion";

// Simple function to format time ago without external dependencies
const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12)
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
};

const PlayHistoryList = ({ playHistory, onGameClick, emptyAction }) => {
  // If there's no play history or it's an empty array
  if (!playHistory || playHistory.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <SportsEsportsIcon sx={{ fontSize: 60, color: "text.secondary" }} />
        <Typography variant="h6" color="text.secondary">
          No play history yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Start playing games to track your activity
        </Typography>
        {emptyAction}
      </Box>
    );
  }

  return (
    <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
      <List sx={{ width: "100%", p: 0 }}>
        {playHistory.map((session, index) => {
          // Add null checks for game data
          const game = session.game || {};
          const defaultImage = "/assets/images/game-placeholder.jpg";

          return (
            <React.Fragment key={session._id || index}>
              <ListItem
                alignItems="flex-start"
                sx={{ cursor: "pointer", py: 2 }}
                onClick={() => onGameClick(game._id)}
                component={motion.div}
                whileHover={{
                  backgroundColor: "rgba(0,0,0,0.04)",
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={game.title || "Game"}
                    src={game.thumbnail || defaultImage}
                    variant="rounded"
                    sx={{ width: 80, height: 80, mr: 2 }}
                  >
                    <SportsEsportsIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      component="div"
                    >
                      {game.title || "Unknown Game"}
                    </Typography>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Played for{" "}
                        {session.duration
                          ? `${Math.round(session.duration / 60)} minutes`
                          : "some time"}
                      </Typography>
                      <Typography component="div" variant="caption">
                        {session.createdAt
                          ? formatTimeAgo(new Date(session.createdAt))
                          : "recently"}
                      </Typography>
                      <Typography
                        component="div"
                        variant="caption"
                        color="primary"
                        sx={{ mt: 0.5 }}
                      >
                        {session.score !== undefined
                          ? `Score: ${session.score}`
                          : ""}
                      </Typography>
                    </React.Fragment>
                  }
                  sx={{ ml: -3 }}
                />
              </ListItem>
              {index < playHistory.length - 1 && <Divider />}
            </React.Fragment>
          );
        })}
      </List>
    </Paper>
  );
};

export default PlayHistoryList;
