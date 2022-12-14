import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import db from "./config/Database.js";
import cookieParser from "cookie-parser";
import UserRoute from "./routes/UserRoute.js";
import ReviewRoute from "./routes/ReviewRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import passportSetup from "./passport.js";
dotenv.config();
export const app = express();

(async () => {
  await db.sync();
})();

app.use(passport.initialize());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(UserRoute);
app.use(ReviewRoute);
app.use(AuthRoute);

app.listen(process.env.PORT, () => {
  console.log("Server up and running...");
});
