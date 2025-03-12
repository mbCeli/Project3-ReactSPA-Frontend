import React, { useState, useEffect } from "react";

import ratingService from "../../../services/rating.service";
import gameService from "../../../services/game.service";

import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress,
  Rating as MuiRating,
  IconButton,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

function CommentsSection({ gameId, user, isLoggedIn, onGameUpdate }) {
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [comment, setComment] = useState("");
  const [currentRating, setCurrentRating] = useState(0);
  const [userRating, setUserRating] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRatingsAndComments = async () => {
      try {
        setIsLoadingComments(true);

        // Get all comments for this game
        const commentsData = await ratingService.getGameComments(gameId);
        setComments(commentsData);

        // Get user's rating if logged in
        if (isLoggedIn) {
          try {
            const { rated, rating } = await ratingService.hasUserRated(gameId);
            if (rated) {
              setUserRating(rating);
              setCurrentRating(rating.score);

              // If editing our own comment, pre-fill it
              if (rating.comments) {
                setEditingComment({
                  id: rating._id,
                  text: rating.comments,
                });
              }
            }
          } catch (err) {
            console.error("Error checking user rating:", err);
          }
        }

        setIsLoadingComments(false);
      } catch (err) {
        console.error("Error fetching ratings and comments:", err);
        setIsLoadingComments(false);
      }
    };

    fetchRatingsAndComments();
  }, [gameId, isLoggedIn]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleRatingChange = (event, newValue) => {
    setCurrentRating(newValue);
  };

  const handleSubmitRatingAndComment = async () => {
    if (!isLoggedIn) {
      // Handle not logged in - this should be handled in the parent component with a snackbar
      return;
    }

    try {
      setIsSubmitting(true);

      let ratingValue = currentRating;
      if (ratingValue < 1 && comment.trim() !== "") {
        // If no rating but has comment, default to 1 star
        ratingValue = 1;
      }

      if (ratingValue < 1 && comment.trim() === "") {
        // Handle empty submission
        setIsSubmitting(false);
        return;
      }

      // Submit rating and comment
      const response = await ratingService.postRatingWithComment(
        gameId,
        ratingValue,
        comment
      );

      // Update local state
      if (editingComment) {
        // Update existing comment
        setComments(
          comments.map((c) =>
            c.id === editingComment.id
              ? {
                  ...c,
                  text: comment,
                  score: ratingValue,
                  date: new Date().toISOString().split("T")[0],
                }
              : c
          )
        );
        setEditingComment(null);
      } else {
        // Add new comment to the top
        const newComment = {
          id: response.data._id,
          user: user.username,
          text: comment,
          score: ratingValue,
          date: new Date().toISOString().split("T")[0],
          userId: user._id,
        };
        setComments([newComment, ...comments]);
      }

      // Update user rating info
      setUserRating(response.data);

      // Clear form
      setComment("");

      // Refresh game data to get updated rating
      const gameResponse = await gameService.getGame(gameId);
      if (onGameUpdate) {
        onGameUpdate(gameResponse.data);
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (ratingId) => {
    try {
      await ratingService.deleteRating(ratingId);

      // Remove from UI
      setComments(comments.filter((comment) => comment.id !== ratingId));

      // Reset user rating state
      setUserRating(null);
      setCurrentRating(0);
      setEditingComment(null);

      // Refresh game data to get updated rating
      const gameResponse = await gameService.getGame(gameId);
      if (onGameUpdate) {
        onGameUpdate(gameResponse.data);
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleEditComment = (commentData) => {
    setEditingComment(commentData);
    setComment(commentData.text);
    setCurrentRating(userRating?.score || 0);
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setComment("");
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        p: 2,
        pt: 0,
        overflow: "hidden",
      }}
    >
      <Typography variant="h6" sx={{ my: 1 }}>
        Comments & Ratings
      </Typography>

      {/* Add rating & comment */}
      {isLoggedIn ? (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="caption" sx={{ mr: 1 }}>
              Rate:
            </Typography>
            <MuiRating
              name="game-rating"
              value={currentRating}
              onChange={handleRatingChange}
              precision={1}
              size="small"
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Share your thoughts..."
              value={comment}
              onChange={handleCommentChange}
              multiline
              rows={2}
              size="small"
            />

            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              {editingComment && (
                <Button
                  variant="outlined"
                  onClick={handleCancelEdit}
                  size="small"
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmitRatingAndComment}
                disabled={isSubmitting || (!currentRating && !comment.trim())}
                startIcon={editingComment ? <EditIcon /> : <SendIcon />}
                size="small"
              >
                {editingComment ? "Update" : "Post"}
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{ mb: 2, p: 1, bgcolor: "#f8f8f8", borderRadius: 1 }}>
          <Typography variant="body2" align="center">
            Please{" "}
            <Link href="/login" underline="hover">
              log in
            </Link>{" "}
            to comment
          </Typography>
        </Box>
      )}

      {/* Comments list with scrolling */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          bgcolor: "rgba(0, 0, 0, 0.02)",
          borderRadius: 1,
          p: 1,
        }}
      >
        {isLoadingComments ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <Box
                  key={comment.id}
                  sx={{ mb: 2, bgcolor: "white", p: 1, borderRadius: 1 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 0.5,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontSize: "0.8rem" }}
                      >
                        {comment.user}
                        {user && comment.userId === user._id && (
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{
                              ml: 0.5,
                              color: "primary.main",
                              fontSize: "0.7rem",
                            }}
                          >
                            (You)
                          </Typography>
                        )}
                      </Typography>

                      {comment.score > 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            ml: 1,
                          }}
                        >
                          <MuiRating
                            value={comment.score}
                            readOnly
                            size="small"
                            sx={{ fontSize: "0.7rem" }}
                          />
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: "0.7rem" }}
                      >
                        {comment.date}
                      </Typography>

                      {/* Edit/Delete actions if it's the user's comment */}
                      {user && comment.userId === user._id && (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => handleEditComment(comment)}
                            sx={{ ml: 0.5, p: 0.5 }}
                          >
                            <EditIcon sx={{ fontSize: "0.9rem" }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteComment(comment.id)}
                            color="error"
                            sx={{ p: 0.5 }}
                          >
                            <DeleteOutlineIcon sx={{ fontSize: "0.9rem" }} />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.85rem",
                      wordBreak: "break-word",
                      justifySelf:"start",
                      textAlign:"justify"
                    }}
                  >
                    {comment.text}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 3 }}
              >
                No comments yet. Be the first to comment!
              </Typography>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

export default CommentsSection;
