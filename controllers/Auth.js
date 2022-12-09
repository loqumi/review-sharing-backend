import User from "../models/UserModel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (Number(user?.status))
    return res.status(406).json({ msg: "You are banned" });
  if (!user) return res.status(404).json({ msg: "user not found" });
  const match = await argon2.verify(user.password, req.body.password);
  if (!match) return res.status(400).json({ msg: "wrong password" });
  const uuid = user.uuid;
  const name = user.name;
  const email = user.email;
  res
    .cookie("token", user.uuid, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json({ uuid, name, email });
};

export const Me = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ msg: "Please login to your account!" });
  }
  const user = await User.findOne({
    attributes: ["uuid", "name", "email", "status"],
    where: {
      uuid: token,
    },
  });
  if (!user) return res.status(404).json({ msg: "user not found" });
  res.status(200).json(user);
};

export const logOut = (req, res) => {
  return res
    .clearCookie("token")
    .status(200)
    .json({ msg: "You have logged out" });
};
