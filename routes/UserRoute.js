import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  blockUsers,
  unBlockUsers,
  deleteUser,
  deleteUsers,
  updateUser,
  getUserRating,
} from "../controllers/Users.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.get("/user/rating", verifyUser, getUserRating);
router.post("/users/block", verifyUser, adminOnly, blockUsers);
router.post("/users/unblock", verifyUser, adminOnly, unBlockUsers);
router.delete("/users/:id", verifyUser, adminOnly, deleteUser);
router.post("/users/delete", verifyUser, adminOnly, deleteUsers);
router.post("/users/:id", verifyUser, updateUser);
export default router;
