import api from "./api.service";

class LeaderboardService {
  submitScore = (gameId, score, details = {}) => {
    return api.post(`/api/leaderboard/games/${gameId}/leaderboard`, {
      score,
      ...details,
    });
  };

  getGameLeaderboard = (gameId, timeframe = "allTime", limit = 10) => {
    return api.get(
      `/api/leaderboard/games/${gameId}/leaderboard?timeframe=${timeframe}&limit=${limit}`
    );
  };

  getUserRanks = (userId = "") => {
    return api.get(`/api/leaderboard/users/${userId || ""}/ranks`);
  };

  getGlobalRankings = (limit = 10) => {
    return api.get(`/api/leaderboard/global?limit=${limit}`);
  };

  // Admin only
  resetLeaderboard = (gameId, timeframe = "allTime") => {
    return api.delete(
      `/api/leaderboard/games/${gameId}/leaderboard?timeframe=${timeframe}`
    );
  };

  deleteUserFromLeaderboard = (gameId, userId, timeframe = "allTime") => {
    return api.delete(
      `/api/leaderboard/games/${gameId}/leaderboard/${userId}?timeframe=${timeframe}`
    );
  };
}

// Create one instance of the service
const leaderboardService = new LeaderboardService();

export default leaderboardService;
