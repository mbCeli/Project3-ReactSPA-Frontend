import "./NotFoundPage.css";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

function NotFoundPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

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

    // Set animation as complete after the animation duration
    const animationTimer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(animationTimer);
      // Don't remove the link if it might be used by other components
    };
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #bbdefb 0%, #90caf9 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated 404 text with bubbles effect */}
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "relative",
          opacity: fontsLoaded ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        {/* 404 Number */}
        <Box
          sx={{
            position: "relative",
            mb: 4,
            height: 200,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Animated Bubbles for 404 */}
          <Box
            sx={{
              position: "absolute",
              top: 20,
              left: "calc(50% - 140px)",
              width: 90,
              height: 90,
              borderRadius: "50%",
              backgroundColor: "#ffcdd2", // Soft pink
              opacity: 0.9,
              animation: "bubble-4 1.5s ease-out forwards",
              "@keyframes bubble-4": {
                "0%": {
                  transform: "scale(0) translateY(100px) rotate(0deg)",
                  opacity: 0,
                },
                "50%": {
                  opacity: 0.8,
                },
                "100%": {
                  transform: "scale(1) translateY(0) rotate(-10deg)",
                  opacity: 0.9,
                },
              },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 30,
              left: "calc(50% - 40px)",
              width: 100,
              height: 100,
              borderRadius: "50%",
              backgroundColor: "#90caf9", // Light blue
              opacity: 0.9,
              animation: "bubble-0 1.5s ease-out 0.2s forwards",
              "@keyframes bubble-0": {
                "0%": {
                  transform: "scale(0) translateY(100px) rotate(0deg)",
                  opacity: 0,
                },
                "50%": {
                  opacity: 0.8,
                },
                "100%": {
                  transform: "scale(1) translateY(0) rotate(10deg)",
                  opacity: 0.9,
                },
              },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 20,
              left: "calc(50% + 50px)",
              width: 90,
              height: 90,
              borderRadius: "50%",
              backgroundColor: "#f8bbd0", // Medium pink
              opacity: 0.9,
              animation: "bubble-4 1.5s ease-out 0.4s forwards",
            }}
          />

          {/* 404 Text */}
          <Typography
            variant="h1"
            sx={{
              fontFamily: "'Luckiest Guy', cursive",
              fontSize: "8rem",
              fontWeight: "bold",
              color: "white",
              textShadow: "4px 4px 0px rgba(0,0,0,0.2)",
              position: "relative",
              zIndex: 10,
              animation: "wobble 2s ease-in-out",
              "@keyframes wobble": {
                "0%, 100%": {
                  transform: "translateX(0)",
                },
                "15%": {
                  transform: "translateX(-10px) rotate(-5deg)",
                },
                "30%": {
                  transform: "translateX(8px) rotate(4deg)",
                },
                "45%": {
                  transform: "translateX(-6px) rotate(-2deg)",
                },
                "60%": {
                  transform: "translateX(4px) rotate(1deg)",
                },
                "75%": {
                  transform: "translateX(-2px) rotate(-0.5deg)",
                },
              },
            }}
          >
            404
          </Typography>
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Bubblegum Sans', cursive",
            color: "#ba68c8", // Purple
            fontWeight: "bold",
            mb: 3,
            opacity: animationComplete ? 1 : 0,
            transform: animationComplete ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease",
          }}
        >
          Oops! This page has floated away...
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontFamily: "'Fredoka One', cursive",
            color: "#424242",
            fontSize: "1.2rem",
            maxWidth: 500,
            mb: 4,
            opacity: animationComplete ? 1 : 0,
            transform: animationComplete ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease 0.1s",
          }}
        >
          The page you're looking for seems to have popped like a bubble!
        </Typography>

        <Button
          variant="contained"
          onClick={() => (isLoggedIn ? navigate("/home") : navigate("/"))}
          sx={{
            borderRadius: 28,
            px: 5,
            py: 1.5,
            fontFamily: "'Fredoka One', cursive",
            fontSize: "1.1rem",
            textTransform: "none",
            backgroundColor: "#42a5f5",
            "&:hover": {
              backgroundColor: "#1e88e5",
              transform: "scale(1.05)",
            },
            transition: "all 0.3s ease",
            boxShadow: "0 4px 10px rgba(66, 165, 245, 0.4)",
            opacity: animationComplete ? 1 : 0,
            transform: animationComplete ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "0.2s",
          }}
        >
          Back to Home
        </Button>

        {/* Additional floating bubbles */}
        <Box
          sx={{
            position: "absolute",
            bottom: "30%",
            right: "10%",
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "#ba68c8", // Purple
            opacity: 0.3,
            animation: "float-forever 5s ease-in-out infinite",
            "@keyframes float-forever": {
              "0%, 100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-20px)" },
            },
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: "20%",
            left: "15%",
            width: 25,
            height: 25,
            borderRadius: "50%",
            backgroundColor: "#f8bbd0", // Pink
            opacity: 0.4,
            animation: "float-forever 7s ease-in-out infinite 1s",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: "20%",
            left: "20%",
            width: 50,
            height: 50,
            borderRadius: "50%",
            backgroundColor: "#42a5f5", // Blue
            opacity: 0.2,
            animation: "float-forever 6s ease-in-out infinite 0.5s",
          }}
        />
      </Container>
    </Box>
  );
}

export default NotFoundPage;
