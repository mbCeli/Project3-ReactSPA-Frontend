import "./LoginPage.css";
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import authService from "../../services/auth.service";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  Stack,
} from "@mui/material";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const navigate = useNavigate();

  const { storeToken, authenticateUser } = useContext(AuthContext);

  // Load custom bubble fonts
  useEffect(() => {
    // Add Google Fonts link for bubble fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Bubblegum+Sans&family=Fredoka+One&family=Luckiest+Guy&display=swap";
    document.head.appendChild(link);

    // Set fonts as loaded after a short delay to ensure they're applied
    const timer = setTimeout(() => {
      setFontsLoaded(true);
    }, 500);

    return () => {
      clearTimeout(timer);
      // Don't remove the link if it might be used by other components
    };
  }, []);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsAnimating(true);

    const requestBody = { email, password };

    authService
      .login(requestBody)
      .then((response) => {
        storeToken(response.data.authToken);
        authenticateUser();
        // Slight delay for animation
        setTimeout(() => {
          navigate("/home");
        }, 600);
      })
      .catch((error) => {
        setIsAnimating(false);
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #bbdefb 0%, #90caf9 100%)",
        py: 4,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative bubbles */}
      <Box
        sx={{
          position: "absolute",
          right: "15%",
          top: "20%",
          width: 50,
          height: 50,
          borderRadius: "50%",
          bgcolor: "#ba68c8",
          opacity: 0.3,
          animation: "float 7s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-20px)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: "10%",
          top: "40%",
          width: 80,
          height: 80,
          borderRadius: "50%",
          bgcolor: "#f8bbd0", 
          opacity: 0.4,
          animation: "float 9s ease-in-out infinite 1s",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: "75%",
          bottom: "15%",
          width: 120,
          height: 120,
          borderRadius: "50%",
          bgcolor: "#42a5f5", 
          opacity: 0.2,
          animation: "float 8s ease-in-out infinite 0.5s",
        }}
      />

      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            mt: 8,
            borderRadius: 5,
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
            transform: isAnimating
              ? "scale(1.05) translateY(-20px)"
              : fontsLoaded
              ? "translateY(0)"
              : "translateY(20px)",
            opacity: fontsLoaded ? 1 : 0,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              fontFamily: "'Luckiest Guy', cursive",
              color: "#42a5f5", // Bright blue
              letterSpacing: "1px",
              mb: 3,
              textShadow: "2px 2px 0px rgba(0,0,0,0.1)",
            }}
          >
            Welcome Back!
          </Typography>

          <Box component="form" onSubmit={handleLoginSubmit} sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              variant="outlined"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleEmail}
              InputLabelProps={{
                style: {
                  fontFamily: "'Fredoka One', cursive",
                  fontWeight: 400,
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 4,
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              variant="outlined"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePassword}
              InputLabelProps={{
                style: {
                  fontFamily: "'Fredoka One', cursive",
                  fontWeight: 400,
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 4,
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isAnimating}
              sx={{
                mt: 3,
                mb: 2,
                borderRadius: 28,
                py: 1.5,
                fontFamily: "'Fredoka One', cursive",
                fontSize: "1.1rem",
                textTransform: "none",
                backgroundColor: "#42a5f5",
                "&:hover": {
                  backgroundColor: "#1e88e5",
                  transform: "scale(1.03)",
                },
                transition: "all 0.3s ease",
                boxShadow: "0 4px 10px rgba(66, 165, 245, 0.4)",
              }}
            >
              {isAnimating ? "Logging in..." : "Login"}
            </Button>
          </Box>

          {errorMessage && (
            <Alert
              severity="error"
              sx={{
                mt: 2,
                borderRadius: 4,
                fontFamily: "'Bubblegum Sans', cursive",
              }}
            >
              {errorMessage}
            </Alert>
          )}

          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <Typography
              variant="body1"
              sx={{
                fontFamily: "'Bubblegum Sans', cursive",
              }}
            >
              Don't have an account yet?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "'Bubblegum Sans', cursive",
                fontWeight: "bold",
              }}
            >
              <Link
                to="/signup"
                style={{
                  textDecoration: "none",
                  color: "#ba68c8",
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginPage;
