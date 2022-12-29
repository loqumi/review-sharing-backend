import express from "express";
import {
  getReviews,
  getMostPopularReviews,
  getRecentlyReviews,
  getReviewById,
  createReview,
  createReviewHowUser,
  updateReview,
  deleteReview,
  setLikeReview,
  setProductRating,
} from "../controllers/Reviews.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/reviews", getReviews);
router.get("/reviews/popular", getMostPopularReviews);
router.get("/reviews/recently", getRecentlyReviews);
router.get("/reviews/:id", getReviewById);
router.get("/reviews/like/:id", verifyUser, setLikeReview);
router.post("/reviews/product/rating/:id", verifyUser, setProductRating);
router.post("/reviews", verifyUser, createReview);
router.post("/reviews/add/:id", verifyUser, createReviewHowUser);
router.post("/reviews/:id", verifyUser, updateReview);
router.delete("/reviews/:id", verifyUser, deleteReview);

export default router;
