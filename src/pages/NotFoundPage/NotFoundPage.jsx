import "./NotFoundPage.css";

import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/Auth.context";


function NotFoundPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h4" color="error" gutterBottom>
        Page Not Found
      </Typography>

      <Button variant="contained" onClick={() => isLoggedIn ? navigate("/home") : navigate("/")} sx={{ mt: 2 }}> 
        {/* tengo que usar el isLoggedIn en vez del IsAnon porque IsAnnon no es una funcion sino un component */}
        Go to Home
      </Button>
    </Box>
  );
}

export default NotFoundPage;
