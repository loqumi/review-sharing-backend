import Reviews from "../models/ReviewModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getReviews = async (req, res) => {
  try {
    let response;
    response = await Reviews.findAll({
      attributes: ["uuid", "name", "price"],
      include: [
        {
          model: User,
          attributes: ["name", "email"],
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const Review = await Reviews.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!Review) return res.status(404).json({ msg: "Not found" });
    let response;
    response = await Reviews.findOne({
      attributes: ["uuid", "name", "price"],
      where: {
        id: Review.id,
      },
      include: [
        {
          model: User,
          attributes: ["name", "email"],
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createReview = async (req, res) => {
  const { name, price } = req.body;
  try {
    await Reviews.create({
      name: name,
      price: price,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Review Created Successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const Review = await Reviews.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!Review) return res.status(404).json({ msg: "Not found" });
    const { name, price } = req.body;
    if (req.role === "admin") {
      await Reviews.update(
        { name, price },
        {
          where: {
            id: Review.id,
          },
        }
      );
    } else {
      if (req.userId !== Review.userId)
        return res.status(403).json({ msg: "Access denied" });
      await Reviews.update(
        { name, price },
        {
          where: {
            [Op.and]: [{ id: Review.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Review updated successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const Review = await Reviews.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!Review) return res.status(404).json({ msg: "Not found" });
    const { name, price } = req.body;
    if (req.role === "admin") {
      await Reviews.destroy({
        where: {
          id: Review.id,
        },
      });
    } else {
      if (req.userId !== Review.userId)
        return res.status(403).json({ msg: "Access denied" });
      await Reviews.destroy({
        where: {
          [Op.and]: [{ id: Review.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Review deleted successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
