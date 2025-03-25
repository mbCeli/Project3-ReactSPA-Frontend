import React, { useState, useRef, useEffect, useContext } from "react";

import aiService from "../../services/ai.service";
import { AuthContext } from "../../context/AuthContext";

import "./AIChatAssisstant.css";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CloseIcon from "@mui/icons-material/Close";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

function AIChatAssistant({ open, onClose }) {
  const { user } = useContext(AuthContext); // Get user from AuthContext
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Load chat history from sessionStorage when component mounts or user changes
   useEffect(() => {
     if (user) {
       const savedMessages = sessionStorage.getItem(`chat_history_${user._id}`);
       if (savedMessages) {
         setMessages(JSON.parse(savedMessages));
       } else {
         // If no saved messages, set the default welcome message
         setMessages([
           {
             role: "assistant",
             content:
               "Hi there! I'm your gaming assistant. Ask me about games, recommendations, or gameplay tips!",
           },
         ]);
       }
     }
   }, [user]);

  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    if (user && messages.length > 0) {
      sessionStorage.setItem(`chat_history_${user._id}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message to chat
    const userMessage = {
      role: "user",
      content: userInput,
    };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsLoading(true);
    setError(null);

    try {
      // Call AI service
      const response = await aiService.sendMessage(userInput);
      
      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.response,
          disclaimer: response.data.disclaimer,
        },
      ]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setError(
        error.response?.data?.message || 
        "Sorry, I couldn't process your request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };


  // If the chat is not open, don't render anything
  if (!open) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 350,
        height: 480,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 1000,
        background: "linear-gradient(135deg, #bbdefb 0%, #90caf9 100%)",
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          bgcolor: "#42a5f5",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              bgcolor: "white",
              color: "#42a5f5",
              width: 32,
              height: 32,
              mr: 1,
            }}
          >
            <SmartToyIcon fontSize="small" />
          </Avatar>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Game Assisstant
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Chat Messages */}
      <Box
        sx={{
          p: 2,
          flexGrow: 1,
          overflowY: "auto",
          bgcolor: "rgba(255, 255, 255, 0.7)",
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              mb: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                maxWidth: "80%",
              }}
            >
              {msg.role !== "user" && (
                <Avatar
                  sx={{
                    bgcolor: "#42a5f5",
                    width: 28,
                    height: 28,
                    mr: 1,
                    mt: 0.5,
                  }}
                >
                  <SmartToyIcon sx={{ fontSize: 16 }} />
                </Avatar>
              )}
              <Paper
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: msg.role === "user" ? "#ba68c8" : "white",
                  color: msg.role === "user" ? "white" : "text.primary",
                  boxShadow: 1,
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {msg.content}
                </Typography>
                {msg.disclaimer && (
                  <Typography
                    variant="caption"
                    sx={{ display: "block", mt: 1, opacity: 0.7 }}
                  >
                    {msg.disclaimer}
                  </Typography>
                )}
              </Paper>
              {msg.role === "user" && (
                <Avatar
                  sx={{
                    bgcolor: "#ba68c8",
                    width: 28,
                    height: 28,
                    ml: 1,
                    mt: 0.5,
                  }}
                >
                  {/* You could use the user's initials or icon here */}
                  <SportsEsportsIcon sx={{ fontSize: 16 }} />
                </Avatar>
              )}
            </Box>
          </Box>
        ))}

        {isLoading && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              ml: 4,
            }}
          >
            <CircularProgress size={16} sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Thinking...
            </Typography>
          </Box>
        )}

        {error && (
          <Box
            sx={{
              p: 1.5,
              ml: 4,
              mt: 1,
              borderRadius: 2,
              bgcolor: "#ffebee",
              color: "#d32f2f",
            }}
          >
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Chat Input */}
      <Box
        sx={{
          p: 2,
          bgcolor: "white",
          display: "flex",
          alignItems: "center",
          borderTop: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <TextField
          fullWidth
          placeholder="Ask about games..."
          size="small"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          sx={{
            mr: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: 4,
            },
          }}
        />
        <Tooltip title="Send message">
          <Button
            variant="contained"
            color="primary"
            disabled={!userInput.trim() || isLoading}
            onClick={handleSendMessage}
            sx={{
              minWidth: "unset",
              width: 40,
              height: 40,
              borderRadius: "50%",
            }}
          >
            <SendIcon fontSize="small" />
          </Button>
        </Tooltip>
      </Box>
    </Paper>
  );
}

export default AIChatAssistant;
