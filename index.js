import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/Database.js";
import cookieParser from "cookie-parser";
import UserRoute from "./routes/UserRoute.js";
import ReviewRoute from "./routes/ReviewRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
dotenv.config();

const app = express();

(async () => {
  await db.sync();
})();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
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
