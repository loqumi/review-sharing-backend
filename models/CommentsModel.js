import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Review from "./ReviewModel.js";
import User from "./UserModel.js";

const { DataTypes } = Sequelize;

const Comments = db.define("comments", {
  uuid: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

Review.hasMany(Comments);
Comments.belongsTo(Review, { foreignKey: "reviewId" });

User.hasMany(Comments);
Comments.belongsTo(User, { foreignKey: "userId" });

export default Comments;
