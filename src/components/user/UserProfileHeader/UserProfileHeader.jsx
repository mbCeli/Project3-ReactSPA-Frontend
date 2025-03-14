import React from "react";
import { useEffect, useState } from "react";

import "./UserProfileHeader.css";
import { motion } from "framer-motion";
import {
  Box,
  Card,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function UserProfileHeader({ user, onEditClick }) {
  const [userData, setUserData] = useState(user);
  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: 3,
        width: "100%", // Ensure it takes full width
        transition: "all 0.3s ease",
      }}
      component={motion.div}
      whileHover={{ y: -5, boxShadow: 5, transition: { duration: 0.2 } }}
    >
      <Box sx={{ position: "relative" }}>
        {/* Cover image/background - increased height */}
        <Box
          sx={{
            height: "120px",
            background:
              "linear-gradient(45deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)",
            position: "relative",
          }}
        />

        {/* Edit profile button */}
        <Tooltip title="Edit Profile">
          <IconButton
            sx={{
              position: "absolute",
              top: 15,
              right: 15,
              backgroundColor: "rgba(255,255,255,0.8)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
            }}
            onClick={onEditClick}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>

        {/* Avatar */}
        <Avatar
          src={userData.profilePicture}
          sx={{
            width: 100,
            height: 100,
            border: "4px solid white",
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "primary.main",
            zIndex: 1,
          }}
        >
          {!userData.profilePicture && <PersonIcon fontSize="large" />}
        </Avatar>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 10,
          p: 3,
        }}
      >
        <Typography variant="h5" sx={{ mb: 1 }}>
          {userData.username}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          {userData.fullName || ""}
        </Typography>

        {user.isAdmin && (
          <Chip
            color="primary"
            size="small"
            icon={<CheckCircleIcon />}
            label="Admin"
            sx={{ mb: 2 }}
          />
        )}
      </Box>
    </Card>
  );
}

export default UserProfileHeader;
