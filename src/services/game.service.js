import api from "./api.service";

class GameService {
  getAllGames = () => {
    return api.get("/api/games");
  };

  getGame = (gameId) => {
    return api.get(`/api/games/${gameId}`);
  };

  getGamesByIds = async (gameIds) => {
    try {
      // If your API has a bulk endpoint, use that
      // return api.post("/api/games/bulk", { ids: gameIds });

      // Otherwise, fetch games one by one and compile the results
      const gamePromises = gameIds.map((id) => this.getGame(id));
      const responses = await Promise.all(gamePromises);
      return responses.map((response) => response.data);
    } catch (error) {
      console.error("Error fetching games by IDs:", error);
      throw error;
    }
  };

  postPlaySession = (gameId, playData) => {
    return api.post(`/api/analytics/games/${gameId}/play`, playData);
  };

  postUserAction = (gameId, action) => {
    return api.post(`/api/analytics/games/${gameId}/action`, {
      userAction: action,
    });
  };

  getGameAnalytics = (gameId) => {
    return api.get(`/api/analytics/games/${gameId}/analytics`);
  };

  getGameRatings = (gameId, sort = "newest") => {
    return api.get(`/api/games/${gameId}/ratings?sort=${sort}`);
  };

  postGameRating = (gameId, score, review = "") => {
    return api.post(`/api/games/${gameId}/ratings`, {
      score,
      review,
    });
  };

  getGameRatingsStats = (gameId) => {
    return api.get(`/api/games/${gameId}/ratings/stats`);
  };

  getGameLeaderboard = (gameId) => {
    return api.get(`/api/leaderboard/games/${gameId}/leaderboard`);
  };

  postScoreLeaderboard = (gameId, score, details = {}) => {
    return api.post(`/api/leaderboard/games/${gameId}/leaderboard`, {
      score,
      ...details,
    });
  };

  getUserFavouriteGames = async () => {
    try {
      // First get the complete user data using our own getCurrentUser method
      const currentUser = await this.getCurrentUser();
      const userId = currentUser._id;
      const userResponse = await api.get(`/api/users/${userId}`);

      // Get the favorite IDs from the full user data
      const favouriteIds = userResponse.data.favourites || [];
      console.log("Favourite IDs:", favouriteIds);

      // If user has no favorites, return empty array
      if (!favouriteIds || favouriteIds.length === 0) {
        console.log("No favourites found");
        return [];
      }

      // Get details for all favorited games
      const games = await this.getGamesByIds(favouriteIds);
      console.log("Favourite games details:", games);
      return games;
    } catch (error) {
      console.error("Error fetching favourite games:", error);
      return []; // Return empty array instead of throwing
    }
  };

  //Admin only
  postGame = (requestBody) => {
    return api.post(`/api/games`, requestBody);
  };

  updateGame = (gameId, requestBody) => {
    return api.put(`/api/games/${gameId}`, requestBody);
  };

  deleteGame = (gameId) => {
    return api.delete(`/api/games/${gameId}`);
  };
}

// Create one instance of the service
const gameService = new GameService();

export default gameService;
