import Reviews from "../models/ReviewModel.js";
import User from "../models/UserModel.js";
import Comments from "../models/CommentsModel.js";

export const addComment = async (req, res) => {
  const { comment, reviewId } = req.body;
  const user = await User.findOne({
    attributes: ["name"],
    where: {
      id: req.userId,
    },
  });
  const response = await Comments.create({
    title: comment,
    name: user.name,
    reviewId,
    userId: req.userId,
  });
  res.status(200).json(response);
};

export const getComments = async (req, res) => {
  try {
    const reviewId = req.query.reviewId;
    const review = await Reviews.findOne({
      attributes: ["id"],
      where: {
        uuid: reviewId,
      },
    });
    const response = await Comments.findAll({
      attributes: ["title", "name", "uuid"],
      where: {
        reviewId: review.id,
      },
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
