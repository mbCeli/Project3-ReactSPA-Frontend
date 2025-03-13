import React from "react";
import { motion } from "framer-motion";
import {
  Box,
  Paper,
  Typography,
  Grid2,
  Card,
  CardContent,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

function AchievementsList({ gameAchievements, emptyAction }) {
  if (!gameAchievements || gameAchievements.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            component="img"
            src="/assets/images/empty-achievements.svg"
            alt="No achievements yet"
            sx={{
              width: "100%",
              maxWidth: 300,
              mb: 2,
              opacity: 0.7,
            }}
          />
          <Typography variant="body1" color="text.secondary">
            You haven't earned any achievements yet.
          </Typography>
          {emptyAction}
        </motion.div>
      </Box>
    );
  }

  return (
    <Box>
      {gameAchievements.map((gameAchievement) => (
        <Box key={gameAchievement.game._id} sx={{ mb: 3 }}>
          <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
              {gameAchievement.game.title}
            </Typography>
            <Grid2 container spacing={2}>
              {gameAchievement.achievements.map((achievement, index) => (
                <Grid2 item xs={6} sm={4} md={3} lg={2} key={index}>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      variant="outlined"
                      sx={{
                        height: "100%",
                        bgcolor: "rgba(255,215,0,0.05)",
                        border: "1px solid rgba(255,215,0,0.3)",
                        transition: "all 0.2s",
                        "&:hover": {
                          boxShadow: 2,
                          bgcolor: "rgba(255,215,0,0.1)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <EmojiEventsIcon
                            sx={{ color: "warning.main", mr: 1 }}
                            fontSize="small"
                          />
                          <Typography variant="subtitle2">
                            {achievement.achievement}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {achievement.description || "Achievement unlocked"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid2>
              ))}
            </Grid2>
          </Paper>
        </Box>
      ))}
    </Box>
  );
}

export default AchievementsList;
