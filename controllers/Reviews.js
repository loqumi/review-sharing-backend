import Reviews from "../models/ReviewModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";
const symbol = "---dhsjk-dashds---";

export const getReviews = async (req, res) => {
  const userId = req.query.userId;
  try {
    let response;
    if (!userId) {
      response = await Reviews.findAll({
        attributes: [
          "id",
          "uuid",
          "title",
          "product",
          "group",
          "tag",
          "text",
          "rating",
          "liked",
        ],
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      const user = await User.findOne({
        attributes: ["id"],
        where: {
          uuid: userId,
        },
      });
      response = await Reviews.findAll({
        attributes: [
          "id",
          "uuid",
          "title",
          "product",
          "group",
          "tag",
          "text",
          "rating",
          "createdAt",
          "liked",
        ],
        where: {
          userId: user.id,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getMostPopularReviews = async (req, res) => {
  try {
    const response = await Reviews.findAll({
      attributes: [
        "id",
        "uuid",
        "title",
        "product",
        "group",
        "tag",
        "text",
        "rating",
        "liked",
      ],
      order: [["liked", "DESC"]],
      limit: 3,
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

export const getRecentlyReviews = async (req, res) => {
  try {
    const response = await Reviews.findAll({
      attributes: [
        "id",
        "uuid",
        "title",
        "product",
        "group",
        "tag",
        "text",
        "rating",
        "liked",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
      limit: 3,
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
      attributes: [
        "id",
        "uuid",
        "title",
        "product",
        "group",
        "tag",
        "text",
        "rating",
        "liked",
        "createdAt",
      ],
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
  const { title, product, group, tag, text, rating } = req.body;
  try {
    await Reviews.create({
      title,
      product,
      group,
      tag: JSON.stringify(tag.map((value) => value.toLowerCase())),
      text,
      rating,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Review Created Successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createReviewHowUser = async (req, res) => {
  const userId = req.query.userId;
  const { title, product, group, tag, text, rating } = req.body;
  const user = await User.findOne({
    attributes: ["id"],
    where: {
      uuid: userId,
    },
  });
  try {
    await Reviews.create({
      title,
      product,
      group,
      tag: tag.join(symbol).toLowerCase(),
      text,
      rating,
      userId: user,
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
    const { title, product, group, tag, text, rating } = req.body;
    if (req.role === "admin") {
      await Review.update(
        { title, product, group, tag, text, rating },
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
        { title, product, group, tag, text, rating },
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
    const { title, product, group, tag, text, rating } = req.body;
    if (req.role === "admin") {
      await Review.destroy({
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

export const setLikeReview = async (req, res) => {
  const { token: userId } = req.cookies;
  try {
    const review = await Reviews.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!review) return res.status(404).json({ msg: "Not found" });
    const likedArr = review.liked ? JSON.parse(review.liked) : [];
    const liked = likedArr.includes(userId)
      ? likedArr.filter((id) => id !== userId)
      : likedArr.concat(userId);
    review.update({
      liked: JSON.stringify(liked),
    });
    res.status(200).json(liked);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
