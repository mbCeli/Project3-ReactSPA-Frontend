import { createContext } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#42a5f5", // Bright blue from the messaging bubbles
      light: "#90caf9",
      dark: "#1976d2",
    },
    secondary: {
      main: "#ba68c8", // Soft purple from the follow button
      light: "#ce93d8",
      dark: "#9c27b0",
    },
    error: {
      main: "#ef5350",
    },
    warning: {
      main: "#ff9800",
    },
    info: {
      main: "#64b5f6",
    },
    success: {
      main: "#66bb6a",
    },
    background: {
      default: "#bbdefb", // Light blue background
      paper: "#ffffff", // White cards/containers
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
    action: {
      active: "#42a5f5",
      hover: "rgba(66, 165, 245, 0.08)",
    },
    // Custom colors based on the image
    custom: {
      softPink: "#ffcdd2", // Soft pink from image elements
      mediumPink: "#f8bbd0", // Medium pink from post
      lightBlue: "#bbdefb", // Light blue background
      brightBlue: "#42a5f5", // Bright blue from message bubbles
      softPurple: "#ba68c8", // Soft purple from buttons
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 20, // Increased from 12 to match the rounded corners in the image
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 28, // More rounded buttons like in the image
          textTransform: "none",
          padding: "8px 24px", // Slightly more padding for buttons
          boxShadow: "none", // Flatter design like in the image
        },
        containedPrimary: {
          backgroundColor: "#42a5f5", // Bright blue button
          "&:hover": {
            backgroundColor: "#1e88e5",
          },
        },
        containedSecondary: {
          backgroundColor: "#ba68c8", // Purple button
          "&:hover": {
            backgroundColor: "#ab47bc",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 28, // Very rounded cards like in the image
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)", // Lighter shadow for a cleaner look
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 28, // Very rounded papers
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16, // Rounded chips
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: "2px solid white", // White border on avatars like in the image
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 20,
          },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: "hidden",
        },
      },
    },
  },
});

// Allow components to access custom colors via theme.palette.custom
theme.palette = {
  ...theme.palette,
  custom: {
    softPink: "#ffcdd2",
    mediumPink: "#f8bbd0",
    lightBlue: "#bbdefb",
    brightBlue: "#42a5f5",
    softPurple: "#ba68c8",
  },
};

const ThemeContext = createContext();

function ThemeProviderWrapper(props) {
  return (
    <ThemeContext.Provider value={{}}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {props.children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export { ThemeContext, ThemeProviderWrapper };
