import api from "./api.service";

class AnalyticsService {
  recordPlaySession = (gameId, playData = {}) => {
    return api.post(`/api/analytics/games/${gameId}/play`, playData);
  };

  recordUserAction = (gameId, action) => {
    return api.post(`/api/analytics/games/${gameId}/action`, {
      userAction: action,
    });
  };

  getGameAnalytics = (gameId) => {
    return api.get(`/api/analytics/games/${gameId}/analytics`);
  };

  getUserPlayHistory = (userId) => {
    // If userId is empty or undefined, use the current user endpoint
    if (!userId) {
      return api.get(`/api/analytics/users/history`);
    }
    return api.get(`/api/analytics/users/${userId}/history`);
  };

  getUserAchievements = (userId) => {
    const endpoint = userId
      ? `/api/analytics/users/${userId}/achievements`
      : `/api/analytics/users/achievements`;
    return api.get(endpoint);
  };

  // Admin only
  getPlatformAnalytics = (timeRange = 30) => {
    return api.get(`/api/analytics/platform?timeRange=${timeRange}`);
  };
}

// Create one instance of the service
const analyticsService = new AnalyticsService();

export default analyticsService;
