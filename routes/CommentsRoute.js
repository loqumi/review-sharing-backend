import express from "express";
import { getComments, addComment } from "../controllers/Comments.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/comments", getComments);
router.post("/comments", verifyUser, addComment);

export default router;
