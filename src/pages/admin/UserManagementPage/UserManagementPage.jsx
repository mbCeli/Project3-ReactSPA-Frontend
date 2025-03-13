import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../../../services/user.service";

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
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
  Chip,
  Avatar,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";

function UserManagementPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    role: "user",
    bio: "",
    ageRange: "18-24",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
      setIsLoading(false);
    }
  };

  const handleOpenDeleteDialog = (user) => {
    setCurrentUser(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentUser(null);
  };

  const handleDeleteUser = async () => {
    try {
      await userService.deleteUser(currentUser._id);
      setUsers(users.filter((user) => user._id !== currentUser._id));
      setSnackbar({
        open: true,
        message: `User "${currentUser.username}" has been deleted successfully`,
        severity: "success",
      });
      handleCloseDeleteDialog();
    } catch (err) {
      console.error("Error deleting user:", err);
      setSnackbar({
        open: true,
        message: `Failed to delete user "${currentUser.username}": ${err.message}`,
        severity: "error",
      });
      handleCloseDeleteDialog();
    }
  };

  const handleOpenEditDialog = (user) => {
    setCurrentUser(user);
    setFormData({
      fullName: user.fullName || "",
      username: user.username || "",
      email: user.email || "",
      role: user.role || "user",
      bio: user.bio || "",
      ageRange: user.ageRange || "18-24",
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setCurrentUser(null);
  };

  const handleOpenAddDialog = () => {
    setFormData({
      fullName: "",
      username: "",
      email: "",
      password: "",
      role: "user",
      bio: "",
      ageRange: "18-24",
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

  const handleUpdateUser = async () => {
    try {
      await userService.updateUser(currentUser._id, formData);

      // Update the users array with the updated user
      setUsers(
        users.map((user) =>
          user._id === currentUser._id ? { ...user, ...formData } : user
        )
      );

      setSnackbar({
        open: true,
        message: `User "${formData.username}" has been updated successfully`,
        severity: "success",
      });

      handleCloseEditDialog();
    } catch (err) {
      console.error("Error updating user:", err);
      setSnackbar({
        open: true,
        message: `Failed to update user "${formData.username}": ${err.message}`,
        severity: "error",
      });
    }
  };

  const handleAddUser = async () => {
    try {
      // Create the new user
      const response = await userService.createNewUser(formData);

      // Add the new user to the users array
      setUsers([...users, response.data]);

      setSnackbar({
        open: true,
        message: `User "${formData.username}" has been created successfully`,
        severity: "success",
      });

      handleCloseAddDialog();
    } catch (err) {
      console.error("Error creating user:", err);
      setSnackbar({
        open: true,
        message: `Failed to create user "${formData.username}": ${err.message}`,
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Get formatted user activity date
  const getLastActive = (user) => {
    if (!user.stats || !user.stats.lastActive) return "Never";
    const date = new Date(user.stats.lastActive);
    return date.toLocaleDateString();
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
  }

  return (
    <Box
      sx={{
        p: 3,
        width: "calc(100% - 120px)",
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
          <Typography variant="h4">User Management</Typography>
        </Box>

        <Box>
          <Tooltip title="Refresh User List">
            <IconButton onClick={fetchUsers} sx={{ mr: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
          >
            Add New User
          </Button>
        </Box>
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button onClick={fetchUsers} size="small" sx={{ ml: 2 }}>
            Retry
          </Button>
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Age Range</TableCell>
                <TableCell>Games Played</TableCell>
                <TableCell>Last Active</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={user.profilePicture}
                          alt={user.username}
                          sx={{ width: 30, height: 30, mr: 1 }}
                        />
                        {user.username}
                      </Box>
                    </TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        icon={
                          user.role === "admin" ? (
                            <AdminPanelSettingsIcon />
                          ) : (
                            <PersonIcon />
                          )
                        }
                        label={user.role}
                        color={user.role === "admin" ? "secondary" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{user.ageRange}</TableCell>
                    <TableCell>{user.stats?.gamesPlayed || 0}</TableCell>
                    <TableCell>{getLastActive(user)}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit User">
                        <IconButton
                          onClick={() => handleOpenEditDialog(user)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton
                          onClick={() => handleOpenDeleteDialog(user)}
                          size="small"
                          color="error"
                          disabled={user.role === "admin"} // Prevent deleting admin users
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No users found
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
            Are you sure you want to delete the user "{currentUser?.username}"?
            This action cannot be undone. All user data, including play history,
            ratings, and leaderboard entries will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Edit User</DialogTitle>
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
              name="fullName"
              label="Full Name"
              value={formData.fullName}
              onChange={handleFormChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleFormChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleFormChange}
              fullWidth
              required
              margin="normal"
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  label="Role"
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Age Range</InputLabel>
                <Select
                  name="ageRange"
                  value={formData.ageRange}
                  onChange={handleFormChange}
                  label="Age Range"
                >
                  <MenuItem value="10-17">10-17</MenuItem>
                  <MenuItem value="18-24">18-24</MenuItem>
                  <MenuItem value="25-34">25-34</MenuItem>
                  <MenuItem value="35-44">35-44</MenuItem>
                  <MenuItem value="45-54">45-54</MenuItem>
                  <MenuItem value="55-64">55-64</MenuItem>
                  <MenuItem value="65+">65+</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              name="bio"
              label="Bio"
              value={formData.bio}
              onChange={handleFormChange}
              fullWidth
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
            onClick={handleUpdateUser}
            variant="contained"
            disabled={
              !formData.fullName || !formData.username || !formData.email
            }
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Create New User</DialogTitle>
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
              name="fullName"
              label="Full Name"
              value={formData.fullName}
              onChange={handleFormChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleFormChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleFormChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              value={formData.password || ""}
              onChange={handleFormChange}
              fullWidth
              required
              margin="normal"
              helperText="Password must contain at least one uppercase letter, one number, and one special character."
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  label="Role"
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Age Range</InputLabel>
                <Select
                  name="ageRange"
                  value={formData.ageRange}
                  onChange={handleFormChange}
                  label="Age Range"
                >
                  <MenuItem value="10-17">10-17</MenuItem>
                  <MenuItem value="18-24">18-24</MenuItem>
                  <MenuItem value="25-34">25-34</MenuItem>
                  <MenuItem value="35-44">35-44</MenuItem>
                  <MenuItem value="45-54">45-54</MenuItem>
                  <MenuItem value="55-64">55-64</MenuItem>
                  <MenuItem value="65+">65+</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              name="bio"
              label="Bio"
              value={formData.bio}
              onChange={handleFormChange}
              fullWidth
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
            onClick={handleAddUser}
            variant="contained"
            disabled={
              !formData.fullName ||
              !formData.username ||
              !formData.email ||
              !formData.password
            }
          >
            Create User
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

export default UserManagementPage;
