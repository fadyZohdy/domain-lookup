import mysql from "mysql2";

import sequelize from "../src/db/models";

const getConnection = (): mysql.Connection => {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
};

const createDB = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const connection = getConnection();
    connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`,
      (err, res) => {
        connection.end();
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });
};

export const dropDB = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const connection = getConnection();
    connection.query(`DROP DATABASE ${process.env.DB_DATABASE}`, (err, res) => {
      connection.end();
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

export const initializeDB = async () => {
  const db = await createDB();
  if (db) {
    await sequelize.sync({ force: true, logging: false });
  }
};
