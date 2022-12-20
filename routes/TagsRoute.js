import express from "express";
import { getTags, postTags } from "../controllers/Tags.js";

const router = express.Router();

router.get("/tags", getTags);
router.post("/tags", postTags);

export default router;
