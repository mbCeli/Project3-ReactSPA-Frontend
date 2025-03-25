import React, { useState } from "react";
import { Fab, Tooltip, Badge } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import AIChatAssistant from "../../ChatAssisstant/AIChatAssisstant";

function AIChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);
 /*  const [hasUnreadMessage, setHasUnreadMessage] = useState(true); */
  // Use localStorage to track if the user has seen the welcome message
  const [hasUnreadMessage, setHasUnreadMessage] = useState(false);

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (hasUnreadMessage && !isChatOpen) {
      setHasUnreadMessage(false);
      // Store in localStorage that user has seen the welcome message
      localStorage.setItem("hasSeenWelcomeMessage", "true");
    }
  };

  return (
    <>
      <Tooltip title="Game Assistant" placement="left">
        <Badge
          color="error"
          variant="dot"
          invisible={!hasUnreadMessage}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
          }}
        >
          <Fab
            color="primary"
            onClick={handleToggleChat}
            sx={{
              background: "linear-gradient(45deg, #42a5f5 30%, #2196f3 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #2196f3 30%, #1976d2 90%)",
              },
              animation: hasUnreadMessage ? "pulse 1.5s infinite" : "none",
              "@keyframes pulse": {
                "0%": { boxShadow: "0 0 0 0 rgba(33, 150, 243, 0.7)" },
                "70%": { boxShadow: "0 0 0 10px rgba(33, 150, 243, 0)" },
                "100%": { boxShadow: "0 0 0 0 rgba(33, 150, 243, 0)" },
              },
            }}
          >
            <SmartToyIcon />
          </Fab>
        </Badge>
      </Tooltip>

      <AIChatAssistant open={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}

export default AIChatButton;
