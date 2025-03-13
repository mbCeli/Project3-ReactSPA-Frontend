// EditProfileDialog.jsx - modify to use avatar selection
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Avatar,
  Typography,
  Grid2,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// List of available avatars (these would be paths to your avatar images)
const AVATARS = [
  "/assets/avatars/avatar1.png",
  "/assets/avatars/avatar2.png",
  "/assets/avatars/avatar3.png",
  "/assets/avatars/avatar4.png",
  "/assets/avatars/avatar5.png",
  "/assets/avatars/avatar6.png",
  "/assets/avatars/avatar7.png",
  "/assets/avatars/avatar8.png",
];

function EditProfileDialog({ open, user, onClose, onSave }) {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");

  // Set initial values when dialog opens
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setFullName(user.fullName || "");
      setSelectedAvatar(user.profilePicture || AVATARS[0]);
    }
  }, [user, open]);

  const handleSave = () => {
    // Prepare updated user data
    const updatedData = {
      username,
      fullName,
      profilePicture: selectedAvatar,
    };

    onSave(updatedData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Edit Profile
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 3 }}
          />

          <TextField
            label="Full Name"
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Choose an Avatar
            </Typography>

            <Grid2 container spacing={2} justifyContent="center">
              {AVATARS.map((avatar, index) => (
                <Grid2 item key={index}>
                  <Avatar
                    src={avatar}
                    sx={{
                      width: 64,
                      height: 64,
                      cursor: "pointer",
                      border:
                        selectedAvatar === avatar
                          ? "3px solid #2196f3"
                          : "3px solid transparent",
                      "&:hover": {
                        transform: "scale(1.05)",
                        transition: "transform 0.2s",
                      },
                    }}
                    onClick={() => setSelectedAvatar(avatar)}
                  />
                </Grid2>
              ))}
            </Grid2>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Avatar
              src={selectedAvatar}
              sx={{
                width: 100,
                height: 100,
                mb: 1,
              }}
            />
          </Box>
          <Typography variant="body2" align="center">
            Selected Avatar
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!username.trim()}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditProfileDialog;
