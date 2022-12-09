import express from "express";
import {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/Reviews.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/reviews", getReviews);
router.get("/reviews/:id", getReviewById);
router.post("/reviews", verifyUser, createReview);
router.patch("/reviews/:id", verifyUser, updateReview);
router.delete("/reviews/:id", verifyUser, deleteReview);

export default router;
