import api from "./api.service";
import authService from "./auth.service";

class UserService {
  getUser = (userId) => {
    return api.get(`/api/users/${userId}`);
  };

  updateUser = (userId, requestBody) => {
    return api.put(`/api/users/${userId}`, requestBody);
  };

  deleteUser = (userId) => {
    return api.delete(`/api/users/${userId}`);
  };

  // Updated method to handle profile updates (username and avatar)
  updateProfile = (userId, profileData) => {
    return api.put(`/api/users/${userId}`, profileData);
  };

  // Get available avatars (can be statically defined or fetched from the backend)
  getAvailableAvatars = () => {
    // This could be hardcoded if avatars are static
    return [
      "/assets/avatars/avatar1.png",
      "/assets/avatars/avatar2.png",
      "/assets/avatars/avatar3.png",
      "/assets/avatars/avatar4.png",
      "/assets/avatars/avatar5.png",
      "/assets/avatars/avatar6.png",
    ];
  };

  getPlayHistory = (userId) => {
    if (!userId) {
      return api.get(`/api/users/history`);
    }
    return api.get(`/api/users/${userId}/history`);
  };

  getUserAchievements = (userId) => {
    if (!userId) {
      return api.get(`/api/users/achievements`);
    }
    return api.get(`/api/users/${userId}/achievements`);
  };

  getUserRank = (userId) => {
    if (!userId) {
      return api.get(`/api/users/ranks`);
    }
    return api.get(`/api/users/${userId}/ranks`);
  };

  getUserRatings = (userId) => {
    if (!userId) {
      return api.get(`/api/users/ratings`);
    }
    return api.get(`/api/users/${userId}/ratings`);
  };

  getUserRatingForGame = (userId) => {
    return api.get(`/api/users/${userId}/my-rating`);
  };

  // Get current user data from auth verify endpoint
  getCurrentUser = async () => {
    try {
      const response = await authService.verify();
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Note: Based on your backend code, the favourites are stored in user.favourites
  // and accessed via user data rather than a dedicated endpoint
  getUserFavourites = async () => {
    try {
      const userData = await this.getCurrentUser();
      return userData.favourites || [];
    } catch (error) {
      throw error;
    }
  };

  addToFavourites = (gameId) => {
    return api.post(`/api/analytics/games/${gameId}/action`, {
      userAction: "favourite",
    });
  };

  removeFromFavourites = (gameId) => {
    return api.post(`/api/analytics/games/${gameId}/action`, {
      userAction: "unfavourite",
    });
  };

  isGameFavourited = async (gameId) => {
    try {
      const favourites = await this.getUserFavourites();
      return favourites.includes(gameId);
    } catch (error) {
      console.error("Error checking favourites:", error);
      return false;
    }
  };

  //Admin only
  getAllUsers = async () => {
    return api.get(`/api/users`);
  };
}

// Create one instance of the service
const userService = new UserService();

export default userService;
