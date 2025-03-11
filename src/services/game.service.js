import api from "./api.service";

class GameService {
  getAllGames = () => {
    return api.get("/games");
  };

  getGame = (gameId) => {
    return api.get(`/games/${gameId}`);
  };

  postPlaySession = (gameId, playData) => {
    return api.post(`/analytics/games/${gameId}/play`, playData);
  };

  postUserAction = (gameId, action) => {
    return api.post(`/analytics/games/${gameId}/action`, {
      userAction: action,
    });
  };

  getGameAnalytics = (gameId) => {
    return api.get(`/analytics/games/${gameId}/analytics`);
  };

  getGameRatings = (gameId, sort = "newest") => {
    return api.get(`/games/${gameId}/ratings?sort=${sort}`);
    //sort added to have that possibility
  };

  postGameRating = (gameId, score, review = "") => {
    return api.post(`/games/${gameId}/ratings`, {
      score,
      review,
    });
  };

  getGameRatingsStats = (gameId) => {
    return api.get(`/games/${gameId}/ratings/stats`);
  };

  getGameLeaderboard = (gameId) => {
    return api.get(`/leaderboard/games/${gameId}/leaderboard`);
  };

  postScoreLeaderboard = (gameId, score, details = {}) => {
    return api.post(`/leaderboard/games/${gameId}/leaderboard`, {
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
      return await getGamesByIds(favoriteIds);
    } catch (error) {
      console.error("Error fetching favorite games:", error);
      throw error;
    }
  };

  //Admin only
  postGame = (requestBody) => {
    return this.api.post(`games`, requestBody);
  };

  updateGame = (gameId, requestBody) => {
    return this.api.post(`games/${gameId}`, requestBody);
  };

  deleteGame = (gameId) => {
    return this.api.post(`games/${gameId}`);
  };
}

// Create one instance of the service
const gameService = new GameService();

export default gameService;
