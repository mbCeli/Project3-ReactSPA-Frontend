import React from "react";
import { Box, Link, Typography } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

const Footer = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        padding: "8px 16px",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(5px)",
        borderTopRightRadius: "8px",
        display: "flex",
        alignItems: "center",
        gap: 1,
        zIndex: 10,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        &copy; {new Date().getFullYear()}
      </Typography>
      <Link
        href="https://github.com/mbCeli/Project3-ReactSPA-Frontend"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: "flex",
          alignItems: "center",
          color: "text.secondary",
          textDecoration: "none",
          "&:hover": {
            color: "#42a5f5",
            textDecoration: "underline",
          },
        }}
      >
        <GitHubIcon sx={{ fontSize: 18, mr: 0.5 }} />
        <Typography variant="body2">Github project repository</Typography>
      </Link>
    </Box>
  );
};

export default Footer;
