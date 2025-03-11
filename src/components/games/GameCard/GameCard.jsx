import { Link } from "react-router-dom";

import "./GameCard.css";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CardActionArea,
  Box,
} from "@mui/material";

function GameCardComponent({ game }) {
  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
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
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {game.description
              ? game.description.substring(0, 75) + "..."
              : "No description available"}
          </Typography>

          <Box
            sx={{
              width: "100%",
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
      <CardActions>
        <Button
          size="small"
          variant="contained"
          component={Link}
          to={`/games/${game._id || game.id}`}
          fullWidth
          id={`view-details-button-of-${game.title}`}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}

export default GameCardComponent;
