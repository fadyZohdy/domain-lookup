import dotenv from "dotenv";

import sequelize from "./db/models";
import Logger from "./utils/logger";
import createApp from "./utils/server";

dotenv.config();

const app = createApp();

// make sure database is established otherwise abort.
sequelize
  .authenticate()
  .then(() => {
    Logger.info("DB connection has been established successfully.");
  })
  .catch((err: Error) => {
    Logger.error("Unable to connect to the database:", err);
    process.exit(0);
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  Logger.info(`⚡️[server]: Server is running at https://localhost:${port}`);
});

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

function shutDown() {
  Logger.info("Received kill signal, shutting down gracefully");
  server.close(() => {
    Logger.info("Closed out remaining connections");
    process.exit(0);
  });
}
