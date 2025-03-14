import { Link } from "react-router-dom";
import { useState } from "react";
import "./GameCard.css";
import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Box,
  Chip,
} from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

function GameCardComponent({ game }) {
  const [elevation, setElevation] = useState(1);

  // Generate a consistent color based on game title or id
  const getGameColor = (str) => {
    const colors = [
      "#ff5252", // red
      "#ff4081", // pink
      "#7c4dff", // deep purple
      "#536dfe", // indigo
      "#448aff", // blue
      "#40c4ff", // light blue
      "#18ffff", // cyan
      "#64ffda", // teal
      "#69f0ae", // green
      "#b2ff59", // light green
      "#eeff41", // lime
      "#ffff00", // yellow
      "#ffd740", // amber
      "#ffab40", // orange deep
      "#ff6e40", // deep orange
    ];

    // Hash the string to get a consistent index
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    return colors[hash % colors.length];
  };

  // Get color based on game category
  const getCategoryColor = (category) => {
    switch (category) {
      case "Puzzle":
        return "#9c27b0"; // purple
      case "Strategy":
        return "#2196f3"; // blue
      case "Arcade":
        return "#f44336"; // red
      case "Adventure":
        return "#4caf50"; // green
      case "Educational":
        return "#ff9800"; // orange
      default:
        return "#607d8b"; // blue grey
    }
  };

  // Generate different pattern for game preview
  const getPatternStyle = (id) => {
    const patterns = [
      "repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px)",
      "repeating-linear-gradient(-45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 5px, rgba(255,255,255,0.2) 5px, rgba(255,255,255,0.2) 10px)",
      "radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
      "linear-gradient(135deg, rgba(255,255,255,0.2) 25%, transparent 25%), linear-gradient(225deg, rgba(255,255,255,0.2) 25%, transparent 25%)",
      "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)",
    ];

    let patternIndex = 0;
    if (id) {
      const numId = parseInt(id.replace(/[^0-9]/g, "")) || 0;
      patternIndex = numId % patterns.length;
    }

    return patterns[patternIndex];
  };

  // Determine game color based on id or title
  const gameColor = getGameColor(game._id || game.title);
  const categoryColor = getCategoryColor(game.category);
  const patternStyle = getPatternStyle(game._id);

  return (
    <Card
      sx={{
        width: "300px",
        height: "200px",
        display: "flex",
        flexDirection: "column",
        maxWidth: "350px",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-8px) scale(1.02)",
          boxShadow: `0 8px 24px rgba(0,0,0,0.15)`,
        },
        borderRadius: "12px",
        overflow: "hidden",
      }}
      id={`game-card-${game.title}`}
      elevation={elevation}
      onMouseEnter={() => setElevation(4)}
      onMouseLeave={() => setElevation(1)}
    >
      <CardActionArea
        component={Link}
        to={`/games/${game._id || game.id}`}
        sx={{ flexGrow: 1 }}
      >
        <CardContent sx={{ p: 2, height: "100%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{
                color: gameColor,
                fontWeight: "bold",
                textShadow: "0px 1px 1px rgba(0,0,0,0.1)",
              }}
            >
              {game.title}
            </Typography>

            {game.category && (
              <Chip
                label={game.category}
                size="small"
                sx={{
                  backgroundColor: categoryColor,
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.7rem",
                  height: "22px",
                }}
              />
            )}
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1.5,
              fontSize: "0.75rem",
              height: "32px",
              overflow: "hidden",
            }}
          >
            {game.description
              ? game.description.substring(0, 80) + "..."
              : "No description available"}
          </Typography>

          <Box
            sx={{
              width: "100%",
              height: "100px",
              backgroundColor: gameColor,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
              backgroundImage: patternStyle,
            }}
          >
            {game.thumbnail ? (
              <img
                src={game.thumbnail}
                alt={game.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <>
                <SportsEsportsIcon
                  sx={{
                    fontSize: 40,
                    color: "white",
                    opacity: 0.8,
                    animation: "pulse 2s infinite",
                    "@keyframes pulse": {
                      "0%": { transform: "scale(1)" },
                      "50%": { transform: "scale(1.1)" },
                      "100%": { transform: "scale(1)" },
                    },
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "white",
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    fontWeight: "bold",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                  }}
                >
                  {game.difficulty || "Play Now"}
                </Typography>
              </>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default GameCardComponent;
