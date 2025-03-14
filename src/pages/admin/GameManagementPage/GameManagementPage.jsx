import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gameService from "../../../services/game.service";

import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";

function GameManagementPage() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    creator: "",
    creatorGithub: "",
    gameUrl: "",
    thumbnail: "",
    category: "Arcade",
    difficulty: "Medium",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  
  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setIsLoading(true);
      const response = await gameService.getAllGames();
      setGames(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching games:", err);
      setError("Failed to load games. Please try again.");
      setIsLoading(false);
    }
  };

  const handleOpenDeleteDialog = (game) => {
    setCurrentGame(game);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentGame(null);
  };

  const handleDeleteGame = async () => {
    try {
      await gameService.deleteGame(currentGame._id);
      setGames(games.filter((game) => game._id !== currentGame._id));
      setSnackbar({
        open: true,
        message: `"${currentGame.title}" has been deleted successfully`,
        severity: "success",
      });
      handleCloseDeleteDialog();
    } catch (err) {
      console.error("Error deleting game:", err);
      setSnackbar({
        open: true,
        message: `Failed to delete "${currentGame.title}": ${err.message}`,
        severity: "error",
      });
      handleCloseDeleteDialog();
    }
  };

  const handleOpenEditDialog = (game) => {
    setCurrentGame(game);
    setFormData({
      title: game.title || "",
      description: game.description || "",
      creator: game.creator || "",
      creatorGithub: game.creatorGithub || "",
      gameUrl: game.gameUrl || "",
      thumbnail: game.thumbnail || "",
      category: game.category || "Arcade",
      difficulty: game.difficulty || "Medium",
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setCurrentGame(null);
  };

  const handleOpenAddDialog = () => {
    setFormData({
      title: "",
      description: "",
      creator: "",
      creatorGithub: "",
      gameUrl: "",
      thumbnail: "/default-game-thumbnail.png",
      category: "Arcade",
      difficulty: "Medium",
    });
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateGame = async () => {
    try {
      const response = await gameService.updateGame(currentGame._id, formData);

      // Update the games array with the updated game
      setGames(
        games.map((game) =>
          game._id === currentGame._id ? { ...game, ...formData } : game
        )
      );

      setSnackbar({
        open: true,
        message: `"${formData.title}" has been updated successfully`,
        severity: "success",
      });

      handleCloseEditDialog();
    } catch (err) {
      console.error("Error updating game:", err);
      setSnackbar({
        open: true,
        message: `Failed to update "${formData.title}": ${err.message}`,
        severity: "error",
      });
    }
  };

  const handleAddGame = async () => {
    try {
      const response = await gameService.postGame(formData);
      setGames([...games, response.data]);

      setSnackbar({
        open: true,
        message: `"${formData.title}" has been added successfully`,
        severity: "success",
      });

      handleCloseAddDialog();
    } catch (err) {
      console.error("Error adding game:", err);
      setSnackbar({
        open: true,
        message: `Failed to add "${formData.title}": ${err.message}`,
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }; 

  return (
    <Box
      sx={{
        p: 3,
        width: "calc(100% - 80px)",
        marginLeft: "200px",
        maxWidth: "1200px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={() => navigate("/admin/dashboard")}
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">Game Management</Typography>
        </Box>

        <Box>
          <Tooltip title="Refresh Game List">
            <IconButton onClick={fetchGames} sx={{ mr: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
          >
            Add New Game
          </Button>
        </Box>
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button onClick={fetchGames} size="small" sx={{ ml: 2 }}>
            Retry
          </Button>
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Creator</TableCell>
                <TableCell align="center">Rating</TableCell>
                <TableCell align="center">Total Plays</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {games.length > 0 ? (
                games.map((game) => (
                  <TableRow key={game._id}>
                    <TableCell>{game.title}</TableCell>
                    <TableCell>{game.category}</TableCell>
                    <TableCell>{game.difficulty}</TableCell>
                    <TableCell>{game.creator}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Rating
                          value={game.rating?.averageScore || 0}
                          precision={0.5}
                          readOnly
                          size="small"
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ({game.rating?.totalRatings || 0})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">{game.totalPlays || 0}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit Game">
                        <IconButton
                          onClick={() => handleOpenEditDialog(game)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Game">
                        <IconButton
                          onClick={() => handleOpenDeleteDialog(game)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No games found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{currentGame?.title}"? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteGame} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Game Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Edit Game</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              mt: 2,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
            }}
          >
            <TextField
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleFormChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="creator"
              label="Creator"
              value={formData.creator}
              onChange={handleFormChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="creatorGithub"
              label="Creator Github URL"
              value={formData.creatorGithub}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="gameUrl"
              label="Game URL"
              value={formData.gameUrl}
              onChange={handleFormChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="thumbnail"
              label="Thumbnail URL"
              value={formData.thumbnail}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  label="Category"
                >
                  <MenuItem value="Puzzle">Puzzle</MenuItem>
                  <MenuItem value="Strategy">Strategy</MenuItem>
                  <MenuItem value="Arcade">Arcade</MenuItem>
                  <MenuItem value="Adventure">Adventure</MenuItem>
                  <MenuItem value="Educational">Educational</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Difficulty</InputLabel>
                <Select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleFormChange}
                  label="Difficulty"
                >
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleFormChange}
              fullWidth
              required
              margin="normal"
              multiline
              rows={4}
              sx={{ gridColumn: "1 / 3" }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button
            onClick={handleUpdateGame}
            variant="contained"
            disabled={
              !formData.title ||
              !formData.description ||
              !formData.creator ||
              !formData.gameUrl
            }
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Game Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Add New Game</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              mt: 2,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
            }}
          >
            <TextField
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleFormChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="creator"
              label="Creator"
              value={formData.creator}
              onChange={handleFormChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="creatorGithub"
              label="Creator Github URL"
              value={formData.creatorGithub}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="gameUrl"
              label="Game URL"
              value={formData.gameUrl}
              onChange={handleFormChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="thumbnail"
              label="Thumbnail URL"
              value={formData.thumbnail}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  label="Category"
                >
                  <MenuItem value="Puzzle">Puzzle</MenuItem>
                  <MenuItem value="Strategy">Strategy</MenuItem>
                  <MenuItem value="Arcade">Arcade</MenuItem>
                  <MenuItem value="Adventure">Adventure</MenuItem>
                  <MenuItem value="Educational">Educational</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Difficulty</InputLabel>
                <Select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleFormChange}
                  label="Difficulty"
                >
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleFormChange}
              fullWidth
              required
              margin="normal"
              multiline
              rows={4}
              sx={{ gridColumn: "1 / 3" }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button
            onClick={handleAddGame}
            variant="contained"
            disabled={
              !formData.title ||
              !formData.description ||
              !formData.creator ||
              !formData.gameUrl
            }
          >
            Add Game
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default GameManagementPage;
