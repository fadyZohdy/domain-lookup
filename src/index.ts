import express, { Express } from "express";
import dotenv from "dotenv";
import promMid from "express-prometheus-middleware";
import morgan from "morgan";

import sequelize from "./db/models";
import { router } from "./routes";
import Logger from "./lib/logger";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

// prometheus exporter
app.use(
  promMid({
    metricsPath: "/metrics",
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
    requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
  })
);

// logging
app.use(morgan("combined"));

app.use("/", router);

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
