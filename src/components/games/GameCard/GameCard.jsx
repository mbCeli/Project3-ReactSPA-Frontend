import { Link } from "react-router-dom";

import "./GameCard.css";
import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Box,
} from "@mui/material";

function GameCardComponent({ game }) {
  return (
    <Card
      sx={{
        width: "300px",
        height: "200px",
        display: "flex",
        flexDirection: "column",
        maxWidth: "350px",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 4,
        },
      }}
      id={`game-card-${game.title}`}
    >
      <CardActionArea
        component={Link}
        to={`/games/${game._id || game.id}`}
        sx={{ flexGrow: 1 }}
      >
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            {game.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize:"0.6rem" }}>
            {game.description
              ? game.description.substring(0, 50) + "..."
              : "No description available"}
          </Typography>

          <Box
            sx={{
              width: "270px",
              height: "100px",
              backgroundColor: "lightgrey",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Game Preview
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea> 
    </Card>
  );
}

export default GameCardComponent;
