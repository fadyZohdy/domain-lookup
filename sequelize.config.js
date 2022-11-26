const dotenv = require("dotenv");

dotenv.config();

const env = process.env.NODE_ENV;

const config = {};

config[env] = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: "mysql",
};

module.exports = config;
