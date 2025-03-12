// LandingPage.jsx
import { useNavigate } from "react-router-dom";

import "./LandingPage.css";
import { Box, Button, Typography, Stack } from "@mui/material";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" gutterBottom>
        Landing Page
      </Typography>
      <Stack direction="row" spacing={2} mt={2}>
            <Button variant="contained" onClick={() => navigate("/login")}>
              Log In
            </Button>

            <Button variant="outlined" onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
      </Stack>
    </Box>
  );
}

export default LandingPage;
