import React from "react";
import { motion } from "framer-motion";
import {
  Box,
  Paper,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Badge,
  Chip,
  Grid2
} from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

function UserRankingsList({ rankings, onGameClick, emptyAction }) {
  if (!rankings || rankings.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            component="img"
            src="/assets/images/empty-rankings.svg"
            alt="No rankings yet"
            sx={{
              width: "100%",
              maxWidth: 300,
              mb: 2,
              opacity: 0.7,
            }}
          />
          <Typography variant="body1" color="text.secondary">
            You don't have any rankings yet.
          </Typography>
          {emptyAction}
        </motion.div>
      </Box>
    );
  }

  return (
    <Grid2 container spacing={2}>
      {rankings.map((rank, index) => (
        <Grid2 item xs={12} md={6} lg={4} key={rank.game._id}>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Paper
              sx={{
                mb: 2,
                borderRadius: 2,
                overflow: "hidden",
                height: "100%",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "stretch", height: "100%" }}
              >
                <Box
                  sx={{
                    width: 8,
                    bgcolor:
                      index < 3
                        ? "success.main"
                        : rank.rank <= 10
                        ? "info.main"
                        : "warning.main",
                  }}
                />
                <ListItem
                  button
                  onClick={() => onGameClick(rank.game._id)}
                  sx={{
                    flexGrow: 1,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      badgeContent={`#${rank.rank}`}
                      color={
                        index < 3
                          ? "success"
                          : rank.rank <= 10
                          ? "info"
                          : "warning"
                      }
                      overlap="circular"
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      <Avatar
                        src={rank.game.thumbnail}
                        variant="rounded"
                        sx={{
                          bgcolor: "primary.light",
                          width: 60,
                          height: 60,
                          mr: 1,
                        }}
                      >
                        <SportsEsportsIcon />
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        {rank.game.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2">
                          Rank: {rank.rank} of {rank.totalPlayers}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "success.main", fontWeight: "bold" }}
                        >
                          Score: {rank.score.toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        mr: 1,
                      }}
                    >
                      Top {Math.round((rank.rank / rank.totalPlayers) * 100)}%
                    </Typography>
                    <Chip
                      size="small"
                      label="Play Now"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </ListItem>
              </Box>
            </Paper>
          </motion.div>
        </Grid2>
      ))}
    </Grid2>
  );
}

export default UserRankingsList;
