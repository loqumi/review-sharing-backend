import { Sequelize } from "sequelize";

const db = new Sequelize("webapp", "webapp", "qsw%X@Y&x6M2GaK", {
  host: "pro.freedb.tech",
  dialect: "mysql",
});

export default db;
