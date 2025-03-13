import React from "react";
import { motion } from "framer-motion";
import {
  Grid2,
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

function FavouriteGamesList({ games, onGameClick, emptyAction }) {
  if (!games || games.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          You don't have any favorite games yet.
        </Typography>
        {emptyAction}
      </Box>
    );
  }

  return (
    <Grid2 container spacing={2}>
      {games.map((game, index) => (
        <Grid2 item xs={12} sm={6} md={4} lg={3} key={game._id}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                cursor: "pointer",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 1,
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 3,
                },
              }}
              onClick={() => onGameClick(game._id)}
            >
              <Box
                sx={{
                  height: 140,
                  backgroundImage: game.thumbnail
                    ? `url(${game.thumbnail})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundColor: "grey.300",
                  position: "relative",
                }}
              >
                <Chip
                  label={game.category || "Game"}
                  size="small"
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    left: 8,
                    bgcolor: "rgba(0,0,0,0.7)",
                    color: "white",
                  }}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" noWrap>
                  {game.title}
                </Typography>
                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Chip
                    size="small"
                    label={`Rating: ${
                      game.rating?.averageScore?.toFixed(1) || "N/A"
                    }`}
                    icon={<StarIcon fontSize="small" />}
                  />
                  <Button size="small" variant="contained">
                    Play
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid2>
      ))}
    </Grid2>
  );
}

export default FavouriteGamesList;
