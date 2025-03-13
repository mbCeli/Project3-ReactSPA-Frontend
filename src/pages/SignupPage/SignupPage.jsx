import "./SignupPage.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const navigate = useNavigate();

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
  const handleConfirmPassword = (e) => setConfirmPassword(e.target.value);
  const handleFirstName = (e) => setFirstName(e.target.value);
  const handleLastName = (e) => setLastName(e.target.value);
  const handleUsername = (e) => setUsername(e.target.value);
  const handleAgeRange = (e) => setAgeRange(e.target.value);

  const handleSignupSubmit = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      return;
    }

    const fullName = `${firstName} ${lastName}`.trim(); // Combined name to match backend expectation

    const requestBody = {
      email,
      password,
      fullName,
      username,
      ageRange,
    };

    authService
      .signup(requestBody)
      .then((response) => {
        navigate("/login");
      })
      .catch((error) => {
        const errorDescription =
          error.response?.data?.message || "Error signing up";
        setErrorMessage(errorDescription);
      });
  };

  return (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(135deg, #bbdefb 0%, #90caf9 100%)",
        py: 2,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Bubbles */}
      <Box
        sx={{
          position: "absolute",
          right: "10%",
          top: "10%",
          width: 80,
          height: 80,
          borderRadius: "50%",
          bgcolor: "rgba(255, 205, 210, 0.5)", 
          filter: "blur(5px)",
          animation: "float 8s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-20px)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: "15%",
          bottom: "15%",
          width: 120,
          height: 120,
          borderRadius: "50%",
          bgcolor: "rgba(186, 104, 200, 0.3)", 
          filter: "blur(8px)",
          animation: "float 10s ease-in-out infinite 1s",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: "75%",
          bottom: "30%",
          width: 60,
          height: 60,
          borderRadius: "50%",
          bgcolor: "rgba(66, 165, 245, 0.4)", 
          filter: "blur(4px)",
          animation: "float 6s ease-in-out infinite 0.5s",
        }}
      />

      <Container maxWidth="sm" sx={{ my: 0, py: 0 }}>
        <Paper
          elevation={8}
          sx={{
            p: 3,
            borderRadius: 5,
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
            transform: fontsLoaded ? "translateY(0)" : "translateY(20px)",
            opacity: fontsLoaded ? 1 : 0,
            maxHeight: "calc(100vh - 40px)",
            overflowY: "auto",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              fontFamily: "'Luckiest Guy', cursive",
              color: "#42a5f5",
              letterSpacing: "1px",
              mb: 2,
              fontSize: "2rem",
            }}
          >
            Join the Fun!
          </Typography>

          <Box component="form" onSubmit={handleSignupSubmit} sx={{ mt: 1 }}>
            <Stack spacing={2}>
              <TextField
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

              <Stack direction="row" spacing={2}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  variant="outlined"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={handleFirstName}
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
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  variant="outlined"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={handleLastName}
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
              </Stack>

              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                variant="outlined"
                autoComplete="username"
                helperText="Your display name in the app."
                value={username}
                onChange={handleUsername}
                InputLabelProps={{
                  style: {
                    fontFamily: "'Fredoka One', cursive",
                    fontWeight: 400,
                  },
                }}
                FormHelperTextProps={{
                  style: { fontFamily: "'Bubblegum Sans', cursive" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 4,
                  },
                }}
              />

              <TextField
                required
                fullWidth
                id="password"
                name="password"
                variant="outlined"
                label="Password"
                type="password"
                autoComplete="new-password"
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

              <TextField
                required
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                variant="outlined"
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPassword}
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

              <FormControl fullWidth required>
                <InputLabel
                  id="age-range-label"
                  sx={{
                    fontFamily: "'Fredoka One', cursive",
                    fontWeight: 400,
                  }}
                >
                  Age Range
                </InputLabel>
                <Select
                  labelId="age-range-label"
                  id="ageRange"
                  name="ageRange"
                  variant="outlined"
                  value={ageRange}
                  label="Age Range"
                  onChange={handleAgeRange}
                  sx={{
                    borderRadius: 4,
                    fontFamily: "'Bubblegum Sans', cursive",
                  }}
                >
                  <MenuItem value="under18">Under 18</MenuItem>
                  <MenuItem value="18-24">18-24</MenuItem>
                  <MenuItem value="25-34">25-34</MenuItem>
                  <MenuItem value="35-44">35-44</MenuItem>
                  <MenuItem value="45-54">45-54</MenuItem>
                  <MenuItem value="55+">55+</MenuItem>
                </Select>
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
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
                Sign Up
              </Button>
            </Stack>
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
            sx={{ mt: 2 }}
          >
            <Typography
              variant="body1"
              sx={{
                fontFamily: "'Bubblegum Sans', cursive",
              }}
            >
              Already have an account?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "'Bubblegum Sans', cursive",
                fontWeight: "bold",
              }}
            >
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  color: "#ba68c8",
                  position: "relative",
                  "&:hover": {
                    "&::after": {
                      width: "100%",
                    },
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -2,
                    left: 0,
                    width: 0,
                    height: 2,
                    backgroundColor: "#ba68c8",
                    transition: "width 0.3s ease",
                  },
                }}
              >
                Login
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default SignupPage;
