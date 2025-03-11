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

  getPlayHistory = (userId) => {
    return api.get(`/api/users/${userId || ""}/history`);
  };
  // ${userId || ""} because the user has two ways of getting his info

  getUserAchievements = (userId) => {
    return api.get(`/api/users/${userId || ""}/achievements`);
  };

  getUserRank = (userId) => {
    return api.get(`/api/users/${userId || ""}/ranks`);
  };

  getUserRatings = (userId) => {
    return api.get(`/api/users/${userId || ""}/ratings`);
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
