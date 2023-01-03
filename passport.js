import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as DiscordStrategy } from "passport-discord";
import User from "./models/UserModel.js";
import { LoginByOAuth, createUserByOAuth } from "./controllers/Auth.js";
import passport from "passport";

const GOOGLE_CLIENT_ID =
  "462098508068-5vda6uetatj6ukfan5clqfi8dufovhno.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const GITHUB_CLIENT_ID = "9043ced65582926a6326";
const GITHUB_CLIENT_SECRET = "55900c170a4ae20e43a076eb9a92fb70521f52f1";
const DISCORD_CLIENT_ID = "1052566896014282782";
const DISCORD_CLIENT_SECRET = "9gVciSZyb5fHpxa1p8WbRQESXOH7UVby";
const URL = "https://webapp-backend-production.up.railway.app";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${URL}/google/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      done(null, profile);
      const user = await User.findOne({
        where: {
          uuid: profile.id,
        },
      });
      user ? LoginByOAuth(user) : createUserByOAuth(profile);
    }
  )
);

passport.use(
  new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "/github/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      done(null, profile);
      const user = await User.findOne({
        where: {
          uuid: profile.id,
        },
      });
      user ? LoginByOAuth(user) : createUserByOAuth(profile);
    }
  )
);

passport.use(
  new DiscordStrategy(
    {
      clientID: DISCORD_CLIENT_ID,
      clientSecret: DISCORD_CLIENT_SECRET,
      callbackURL: "/discord/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      done(null, profile);
      const user = await User.findOne({
        where: {
          uuid: profile.id,
        },
      });
      user ? LoginByOAuth(user) : createUserByOAuth(profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
