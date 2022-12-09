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

router.get("/products", getReviews);
router.get("/products/:id", getReviewById);
router.post("/products", verifyUser, createReview);
router.patch("/products/:id", verifyUser, updateReview);
router.delete("/products/:id", verifyUser, deleteReview);

export default router;
