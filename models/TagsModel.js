import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Tags = db.define("tags", {
  title: {
    type: DataTypes.STRING,
    allowNullL: false,
  },
});
export default Tags;
