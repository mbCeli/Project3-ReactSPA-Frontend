import React from "react";

import "./GameStats.css";
import { Grid2, Card, Typography, Box } from "@mui/material";

function GameStats({ game, user }) {

  const cardStyle = {
    textAlign: "center",
    width:"100px",
    height: "100%",
    minHeight: "80px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    py: 1,
    overflow: "hidden",
  };

  return (
    <Box sx={{ p: 1 }}>
      <Grid2 container spacing={1}>
        {/* Your Score */}
        <Grid2 item xs={4}>
          <Card variant="outlined" sx={cardStyle}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 0.5, fontSize: "0.75rem" }}
            >
              Your Score
            </Typography>
            <Typography
              variant="h6"
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              {user?.gameStats?.[game._id]?.bestScore || "-"}
            </Typography>
          </Card>
        </Grid2>

        {/* Global Rating */}
        <Grid2 item xs={4}>
          <Card variant="outlined" sx={cardStyle}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 0.5, fontSize: "0.75rem" }}
            >
              Rating
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                {game.rating?.averageScore?.toFixed(1) || "0"}
                <span style={{ fontSize: "0.8rem", color:"black", fontWeight:"normal" }}>/5</span>
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.65rem" }}
              >
                Total ratings ({game.rating?.totalRatings || 0})
              </Typography>
            </Box>
          </Card>
        </Grid2>

        {/* Play Count */}
        <Grid2 item xs={4}>
          <Card variant="outlined" sx={cardStyle}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 0.5, fontSize: "0.75rem" }}
            >
              Total Plays
            </Typography>
            <Typography
              variant="h6"
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              {game.totalPlays || 0}
            </Typography>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default GameStats;
