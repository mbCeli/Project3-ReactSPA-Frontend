import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";

import { AuthContext } from "../../context/AuthContext";

import "./LogoutPage.css";
import { Box, Typography, Button, Stack } from "@mui/material";

function LogoutPage() {
  const { logOutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    logOutUser();
  }, []);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack>
        <Typography variant="h6">Goodbye player</Typography>
        <Typography variant="h6">See you soon!</Typography>
      </Stack>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h4" sx={{ margin: "30px 0 10px 0" }}>
          Did you logout by mistake?
        </Typography>
        <Button
          variant="contained"
          sx={{ width: "200px", height: "50px", fontSize: "20px" }}
          onClick={() => {
            console.log("log back in button clicked");
            navigate("/login");
          }}
        >
          Log back in
        </Button>
      </Box>
    </Box>
  );
}

export default LogoutPage;
