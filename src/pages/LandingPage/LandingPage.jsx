// LandingPage.jsx
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../../context/Auth.context";

import "./LandingPage.css";
import { Box, Button, Typography, Stack } from "@mui/material";

function LandingPage() {
  const navigate = useNavigate();
  const { isLoggedIn, logOutUser } = useContext(AuthContext);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" gutterBottom>
        Landing Page
      </Typography>

      <Stack direction="row" spacing={2} mt={2}>
        {!isLoggedIn ? (
          <>
            <Button variant="contained" onClick={() => navigate("/login")}>
              Log In
            </Button>

            <Button variant="outlined" onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </>
        ) : (
          <Button variant="contained" color="secondary" onClick={logOutUser}>
            Log Out
          </Button>
        )}
      </Stack>
    </Box>
  );
}

export default LandingPage;
