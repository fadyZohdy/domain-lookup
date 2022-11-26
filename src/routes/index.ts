import express, { Request, Response, Router } from "express";

import { router as v1Routes } from "./v1";
import QueryDAL from "../db/dal/query.dal";

const router: Router = express.Router();

const unixTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

router.get("/", (req: Request, res: Response) => {
  res.json({
    version: process.env.npm_package_version,
    date: unixTimestamp(),
    kubernetes: process.env.KUBERNETES_SERVICE_HOST != undefined,
  });
});

router.get("/health", (req: Request, res: Response) => {
  res.send("Ok");
});

router.get("/history", async (req: Request, res: Response) => {
  const clientIP = req.header("x-forwarded-for") || req.socket.remoteAddress;
  const queries = await QueryDAL.latest(clientIP);
  res.json(queries);
});

router.use("/v1", v1Routes);

export { router };
