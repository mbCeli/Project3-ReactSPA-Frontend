import api from "./api.service";

class RatingService {
  getGameRatings = (gameId, sort = "newest") => {
    return api.get(`/api/games/${gameId}/ratings?sort=${sort}`);
  };

  createOrUpdateRating = (gameId, score, comments = "") => {
    return api.post(`/api/games/${gameId}/ratings`, {
      score,
      comments,
    });
  };

  getUserGameRating = (gameId) => {
    return api.get(`/api/games/${gameId}/my-rating`);
  };

  getGameRatingStats = (gameId) => {
    return api.get(`/api/games/${gameId}/ratings/stats`);
  };

  getUserRatings = () => {
    return api.get(`/api/users/ratings`);
  };

  getUserRatingsById = (userId) => {
    return api.get(`/api/users/${userId}/ratings`);
  };

  deleteRating = (ratingId) => {
    return api.delete(`/api/ratings/${ratingId}`);
  };

  hasUserRated = async (gameId) => {
    try {
      const response = await this.getUserGameRating(gameId);
      return { rated: true, rating: response.data };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { rated: false, rating: null };
      }
      throw error;
    }
  };

  getGameComments = async (gameId, sort = "newest") => {
    try {
      const response = await this.getGameRatings(gameId, sort);
      return this.formatRatingsAsComments(response.data);
    } catch (error) {
      console.error("Error fetching game comments:", error);
      throw error;
    }
  };

  postComment = (gameId, commentText) => {
    if (!commentText || commentText.trim() === "") {
      return Promise.reject(new Error("Comment text cannot be empty"));
    }

    return this.createOrUpdateRating(gameId, 1, commentText);
  };

  // Helper method to sort and process ratings for display as comments
  formatRatingsAsComments = (ratings) => {
    if (!ratings || !Array.isArray(ratings)) {
      return [];
    }

    return ratings
      .filter((rating) => rating.comments && rating.comments.trim() !== "")
      .map((rating) => ({
        id: rating._id,
        user: rating.user?.username || "Anonymous",
        text: rating.comments,
        score: rating.score,
        date: new Date(rating.createdAt).toISOString().split("T")[0],
        userId: rating.user?._id,
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  postRatingWithComment = (gameId, score, commentText = "") => {
    if (score < 1 || score > 5) {
      return Promise.reject(new Error("Score must be between 1 and 5"));
    }

    return this.createOrUpdateRating(gameId, score, commentText);
  };
}

// Create one instance of the service
const ratingService = new RatingService();

export default ratingService;
