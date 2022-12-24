import User from "../models/UserModel.js";
import Reviews from "../models/ReviewModel.js";
import argon2 from "argon2";

// ----------- ##used func -----------

// ##get one user by ID
const getUser = async (id) => {
  return await User.findOne({
    where: {
      uuid: id,
    },
  });
};

// ##get one user by EMAIL
const getUserByEmail = async (email) => {
  return await User.findOne({
    where: {
      email,
    },
  });
};

// ---------- #Users actions -------------

// ##Get all users
export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: [
        "uuid",
        "name",
        "email",
        "status",
        "role",
        "rating",
        "createdAt",
        "updatedAt",
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ##Get one user by ID
export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      attributes: [
        "uuid",
        "name",
        "email",
        "status",
        "role",
        "rating",
        "createdAt",
        "updatedAt",
      ],
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// ##Register new user info
export const createUser = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  const emailExist = await getUserByEmail(email);
  if (emailExist) return res.status(409).json({ msg: "Email already used" });
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "password and confirm password do not match" });
  const hashPassword = await argon2.hash(password);
  try {
    await User.create({
      name: name,
      email: email,
      password: hashPassword,
    });
    res.status(201).json({ msg: "successful registration" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// ##Change user by user information
export const updateUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found" });
  const { name, email, password, confPassword, role } = req.body;
  let hashPassword;
  if (password === "" || password === null) {
    hashPassword = user.password;
  } else {
    hashPassword = await argon2.hash(password);
  }
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password and Confirm password dont match" });
  try {
    await User.update(
      {
        name: name,
        email: email,
        password: hashPassword,
        role: role,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getUserRating = async (req, res) => {
  const userId = req.query.userId;
  const user = await User.findOne({
    attributes: ["id"],
    where: {
      uuid: userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found" });
  try {
    const response = await Reviews.findAll({
      attributes: ["liked"],
      where: {
        userId: user.id,
      },
    });
    res
      .status(200)
      .json(
        response
          .map((value) => JSON.parse(value.liked).length)
          .reduce((a, b) => a + b)
      );
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// ---------- #Admin actions on users -------------

// ---------- ##used func ------------

// ###Update status of user on BLOCK
const updateUserBlockInfo = (data) => {
  return User.update(
    {
      ...data,
      status: 1,
    },
    {
      where: {
        uuid: data.uuid,
      },
    }
  );
};

// ###Update status of user on UNBLOCK
const updateUserUnBlockInfo = (data) => {
  return User.update(
    {
      ...data,
      status: 0,
    },
    {
      where: {
        uuid: data.uuid,
      },
    }
  );
};

// ###Delete one user of array selected Users
const removeUser = async (id) => {
  return await User.destroy({
    where: {
      uuid: id,
    },
  });
};

// ------------ ##actions ---------------

// ##Block user
export const blockUsers = (req, res) => {
  const data = req.body;
  Promise.all(data.map(updateUserBlockInfo))
    .then(() => res.status(200).json({ msg: "all complete" }))
    .catch((error) => res.status(500).json({ msg: error.message }));
};

// ##Unblock user
export const unBlockUsers = (req, res) => {
  const data = req.body;
  Promise.all(data.map(updateUserUnBlockInfo))
    .then(() => res.status(200).json({ msg: "all complete" }))
    .catch((error) => res.status(500).json({ msg: error.message }));
};

// ##Delete user
export const deleteUser = (req, res) => {
  const user = getUser(req.params.id);
  if (!user) return res.status(404).json({ msg: "user not found" });
  try {
    removeUser(user.id);
    res.status(200).json({ msg: "successful deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// ##Delete all selected users
export const deleteUsers = (req, res) => {
  const selectedUsers = req.body;
  Promise.all(selectedUsers.map(removeUser)).then(() =>
    res.status(200).json({ msg: "all complete" })
  );
};
