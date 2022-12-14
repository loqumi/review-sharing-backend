import express from "express";
import passport from "passport";
import { Login, logOut, Me } from "../controllers/Auth.js";
import { verifyUser } from "../middleware/AuthUser.js";

const CLIENT_URL = "http://localhost:3000/";
const router = express.Router();

router.get("/me", verifyUser, Me);
router.post("/login", Login);
router.delete("/logout", logOut);

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      cookies: req.cookies,
    });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get("/google/callback", (req, res) => {
  return passport.authenticate(
    "google",
    {
      successRedirect: CLIENT_URL,
      failureRedirect: "/login/failed",
    },
    async (err, user) => {
      res.cookie("token", user.id, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.redirect(CLIENT_URL);
    }
  )(req, res);
});

router.get("/github", passport.authenticate("github", { scope: ["profile"] }));
router.get("/github/callback", (req, res) => {
  return passport.authenticate(
    "github",
    {
      successRedirect: CLIENT_URL,
      failureRedirect: "/login/failed",
    },
    async (err, user) => {
      res.cookie("token", user.id, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.redirect(CLIENT_URL);
    }
  )(req, res);
});

router.get(
  "/discord",
  passport.authenticate("discord", { scope: ["identify"] })
);
router.get("/discord/callback", (req, res) => {
  return passport.authenticate(
    "discord",
    {
      successRedirect: CLIENT_URL,
      failureRedirect: "/login/failed",
    },
    async (err, user) => {
      res.cookie("token", user.id, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.redirect(CLIENT_URL);
    }
  )(req, res);
});

export default router;
