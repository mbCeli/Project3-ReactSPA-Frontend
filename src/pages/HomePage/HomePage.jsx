import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/Auth.context";

import "./HomePage.css";
import { Box, Typography, Button } from "@mui/material";
import { clear } from "@testing-library/user-event/dist/cjs/utility/clear.js";

function HomePage() {
const { isLoggedIn, logOutUser, user } = useContext(AuthContext);

  const navigate = useNavigate();

   const handleLogout = () => {
    console.log("logout button clicked");
     navigate("/logout");
   };

  return (
    <Box>
      <Typography variant="h2" sx={{ margin: "30px" }}>
        Home page
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {isLoggedIn && user ? (
          <>
            <Typography variant="h4" sx={{ margin: "10px" }}>
              Welcome {user.username}
            </Typography>
            <Typography variant="h5" sx={{ margin: "10px" }}>
              {user.isAdmin ? "You have admin privileges" : ""}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h4">You are not logged in</Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/login")}
            >
              Log In
            </Button>
          </>
        )}
      </Box>

        <Box>
          
        </Box>
    </Box>
  );
}

export default HomePage;

