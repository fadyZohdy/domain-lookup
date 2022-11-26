import { Dialect, Sequelize } from "sequelize";

export default new Sequelize(
  process.env.DB_DATABASE as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST as string,
    dialect: "mysql" as Dialect,
  }
);
