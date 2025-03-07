import React, { useState } from "react";
import { Box, Paper, IconButton, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { MdGames, MdLeaderboard, MdAdd, MdPerson } from "react-icons/md";

// Styled components
const SidebarContainer = styled(Paper)(({ theme }) => ({
  position: "fixed",
  left: theme.spacing(2),
  top: "50%",
  transform: "translateY(-50%)",
  borderRadius: 30,
  padding: theme.spacing(2, 1),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(3),
  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
  zIndex: 1000,
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(8px)",
}));

const AddButtonContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const AddButton = styled(motion.div)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
  color: "#fff",
}));

const NavItem = styled(IconButton)(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  padding: theme.spacing(1.5),
  transition: "all 0.3s ease",
}));

// Main component
const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("games");
  const theme = useTheme();

  return (
    <SidebarContainer elevation={3}>
      <NavItem
        active={activeTab === "games"}
        onClick={() => setActiveTab("games")}
      >
        <MdGames size={24} />
      </NavItem>

      <AddButtonContainer>
        <AddButton whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <MdAdd size={28} />
        </AddButton>
      </AddButtonContainer>

      <NavItem
        active={activeTab === "leaderboard"}
        onClick={() => setActiveTab("leaderboard")}
      >
        <MdLeaderboard size={24} />
      </NavItem>

      <NavItem
        active={activeTab === "profile"}
        onClick={() => setActiveTab("profile")}
      >
        <MdPerson size={24} />
      </NavItem>
    </SidebarContainer>
  );
};

export default Sidebar;
