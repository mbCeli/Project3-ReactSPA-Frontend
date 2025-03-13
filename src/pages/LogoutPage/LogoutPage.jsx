import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Container, Button } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

function LogoutPage() {
  const navigate = useNavigate();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const { logOutUser } = useContext(AuthContext);

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

    // Execute logout sequence
    logOutUser();

    // Animation sequence timers
    const timer1 = setTimeout(() => setAnimationStep(1), 800);
    const timer2 = setTimeout(() => setAnimationStep(2), 1600);
    const timer3 = setTimeout(() => setAnimationStep(3), 2400);
    const timer4 = setTimeout(() => setAnimationStep(4), 3200);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      // Don't remove the link if it might be used by other components
    };
  }, [logOutUser]);

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
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "relative",
          zIndex: 10,
          opacity: fontsLoaded ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        {/* Hand waving animation */}
        <Box
          sx={{
            fontSize: "6rem",
            mb: 2,
            transition: "transform 0.3s ease",
            display: "inline-block",
            animation: "wave 1.5s ease-in-out infinite",
            transformOrigin: "70% 70%",
            "@keyframes wave": {
              "0%": { transform: "rotate(0deg)" },
              "10%": { transform: "rotate(14deg)" },
              "20%": { transform: "rotate(-8deg)" },
              "30%": { transform: "rotate(14deg)" },
              "40%": { transform: "rotate(-4deg)" },
              "50%": { transform: "rotate(10deg)" },
              "60%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(0deg)" },
            },
          }}
        >
          👋
        </Box>

        <Typography
          variant="h2"
          sx={{
            fontFamily: "'Luckiest Guy', cursive",
            color: "#42a5f5",
            textShadow: "3px 3px 0px rgba(0,0,0,0.1)",
            mb: 3,
            opacity: animationStep >= 1 ? 1 : 0,
            transform:
              animationStep >= 1 ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease",
          }}
        >
          Goodbye!
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Bubblegum Sans', cursive",
            color: "#ba68c8", // Purple
            mb: 3,
            opacity: animationStep >= 2 ? 1 : 0,
            transform:
              animationStep >= 2 ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease",
          }}
        >
          Hope to see you soon!
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: "1.2rem",
            color: "#424242",
            maxWidth: 400,
            mb: 4,
            opacity: animationStep >= 3 ? 1 : 0,
            transform:
              animationStep >= 3 ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease",
          }}
        >
          You've been successfully logged out. What would you like to do next?
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            opacity: animationStep >= 4 ? 1 : 0,
            transform:
              animationStep >= 4 ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease",
          }}
        >
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              borderRadius: 28,
              px: 4,
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
            }}
          >
            Go to Home
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate("/login")}
            sx={{
              borderRadius: 28,
              px: 4,
              py: 1.5,
              fontFamily: "'Fredoka One', cursive",
              fontSize: "1.1rem",
              textTransform: "none",
              borderColor: "#ba68c8",
              color: "#ba68c8",
              borderWidth: 2,
              "&:hover": {
                borderColor: "#9c27b0",
                backgroundColor: "rgba(186, 104, 200, 0.08)",
                transform: "scale(1.05)",
                borderWidth: 2,
              },
              transition: "all 0.3s ease",
            }}
          >
            Log In Again
          </Button>
        </Box>
      </Container>

      
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        
        {[...Array(8)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: 20 + Math.random() * 60,
              height: 20 + Math.random() * 60,
              borderRadius: "50%",
              backgroundColor: [
                "#ffcdd2",
                "#f8bbd0", 
                "#42a5f5", 
                "#90caf9", 
                "#ba68c8", 
                "#ce93d8", 
              ][Math.floor(Math.random() * 6)],
              opacity: 0.6,
              left: `${Math.random() * 100}%`,
              bottom: "-100px",
              animation: `float-away ${
                7 + Math.random() * 5
              }s linear forwards ${Math.random() * 2}s`,
              "@keyframes float-away": {
                "0%": {
                  transform: "translateY(0) scale(0)",
                  opacity: 0,
                },
                "10%": {
                  transform: "translateY(-100px) scale(1)",
                  opacity: 0.6,
                },
                "100%": {
                  transform: `translateY(-${
                    window.innerHeight + 200
                  }px) scale(0.8)`,
                  opacity: 0,
                },
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default LogoutPage;
