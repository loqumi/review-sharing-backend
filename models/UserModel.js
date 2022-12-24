import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const User = db.define(
  "users",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNullL: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNullL: false,
      defaultValue: "",
    },
    email: {
      type: DataTypes.STRING,
      allowNullL: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNullL: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNullL: false,
      defaultValue: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
      validate: {
        notEmpty: true,
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
  }
);

export default User;
