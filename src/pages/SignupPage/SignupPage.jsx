//Updated para matener consistency with the rest of the project (using material ui)

import "./SignupPage.css";
import { useState } from "react";
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

  const navigate = useNavigate();

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
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Sign Up
        </Typography>

        <Box component="form" onSubmit={handleSignupSubmit} sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              variant="standard"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleEmail}
            />

            <Stack direction="row" spacing={2}>
              <TextField
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                variant="standard"
                autoComplete="given-name"
                value={firstName}
                onChange={handleFirstName}
              />
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                variant="standard"
                autoComplete="family-name"
                value={lastName}
                onChange={handleLastName}
              />
            </Stack>

            <TextField
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              variant="standard"
              autoComplete="username"
              helperText="This username will be your displayed name in the app."
              value={username}
              onChange={handleUsername}
            />

            <TextField
              required
              fullWidth
              id="password"
              name="password"
              variant="standard"
              label="Password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={handlePassword}
            />

            <TextField
              required
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              variant="standard"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPassword}
            />

            <FormControl fullWidth required>
              <InputLabel id="age-range-label">Age Range</InputLabel>
              <Select
                labelId="age-range-label"
                id="ageRange"
                name="ageRange"
                variant="standard"
                value={ageRange}
                label="Age Range"
                onChange={handleAgeRange}
              >
                <MenuItem value="under18">Under 18</MenuItem>
                <MenuItem value="18-24">18-24</MenuItem>
                <MenuItem value="25-34">25-34</MenuItem>
                <MenuItem value="35-44">35-44</MenuItem>
                <MenuItem value="45-54">45-54</MenuItem>
                <MenuItem value="55+">55+</MenuItem>
              </Select>
            </FormControl>

            <Button type="submit" fullWidth variant="contained">
              Sign Up
            </Button>
          </Stack>
        </Box>

        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          sx={{ mt: 2 }}
        >
          <Typography variant="body2">Already have an account?</Typography>
          <Typography variant="body2">
            <Link to="/login" style={{ textDecoration: "none" }}>
              Login
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}

export default SignupPage;
