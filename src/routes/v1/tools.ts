import dns from "dns";
import url from "url";

import express, { Request, Response, Router } from "express";
import validator from "validator";

import queryDAL from "../../db/dal/query.dal";

const router: Router = express.Router();

const isIPV4Address = (address: string): boolean => {
  const ipV4Regex =
    "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}";
  return new RegExp(`^${ipV4Regex}$`).test(address);
};

const resolveDomain = async (domain: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    dns.resolve(domain, (err, ips) => {
      if (err) {
        reject(err);
      } else {
        resolve(ips);
      }
    });
  });
};

router.get("/lookup", async (req: Request, res: Response) => {
  let domain = req.query.domain as string;
  if (!domain || !validator.isURL(domain, { require_valid_protocol: false })) {
    return res
      .status(400)
      .json({ message: "missing valid domain/url query param" });
  }

  domain = url.parse(domain).hostname || domain;

  try {
    const ips = await resolveDomain(domain.toString());
    if (ips.length == 0) {
      return res.status(404).json({ message: "ENOTFOUND" });
    }
    const clientIP = req.header("x-forwarded-for") || req.socket.remoteAddress;
    const query = {
      addresses: ips,
      client_ip: clientIP,
      domain: domain,
    };
    const response = await queryDAL.create(query);
    return res.json(response);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(404).json({ message: err.message });
    }
    return res.status(404).json({ message: err });
  }
});

router.post("/validate", (req: Request, res: Response) => {
  const { ip } = req.body;
  if (!ip) {
    return res.status(400).json({ message: "ip is required" });
  }

  if (isIPV4Address(ip)) {
    return res.json({ status: true });
  } else {
    return res.status(400).json({ message: "invalid ipv4" });
  }
});

// module.exports = router;
export { router };
