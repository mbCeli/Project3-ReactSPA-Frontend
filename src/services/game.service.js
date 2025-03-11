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

  getUserFavoriteGames = async () => {
    try {
      // First get the user data with favorites from the verify endpoint
      const userResponse = await api.get("/auth/verify");
      const favoriteIds = userResponse.data.favourites || [];

      // If user has no favorites, return empty array
      if (favoriteIds.length === 0) {
        return [];
      }

      // Get details for all favorited games
      return await this.getGamesByIds(favoriteIds);
    } catch (error) {
      console.error("Error fetching favorite games:", error);
      throw error;
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
