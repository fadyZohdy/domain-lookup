import express, { Express } from "express";
import promMid from "express-prometheus-middleware";
import morgan from "morgan";

import { router } from "../routes";

export default () => {
  const server: Express = express();

  server.use(express.json());

  // prometheus exporter
  server.use(
    promMid({
      metricsPath: "/metrics",
      collectDefaultMetrics: true,
      requestDurationBuckets: [0.1, 0.5, 1, 1.5],
      requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
      responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    })
  );

  // logging
  server.use(morgan("combined"));

  server.use("/", router);

  return server;
};
