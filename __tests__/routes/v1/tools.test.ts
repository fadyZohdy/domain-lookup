import request from "supertest";
import { Express } from "express";

import createServer from "../../../src/utils/server";
import { initializeDB, dropDB } from "../../helpers";
import queryDAL from "../../../src/db/dal/query.dal";

let server: Express;

beforeAll(async () => {
  server = await createServer();
  await initializeDB();
});
beforeEach(queryDAL.truncate);
afterAll(dropDB);

describe("GET /lookup", () => {
  it("should return query for valid domain", async () => {
    const valid_domains = [
      "google.com",
      "https://google.com",
      "https://www.google.com/search?client=firefox-b-d&q=jest",
    ];
    for (const domain of valid_domains) {
      const res = await request(server).get(
        `/v1/tools/lookup?domain=${domain}`
      );

      expect(res.statusCode).toBe(200);
    }
    const latestQueries = await queryDAL.latest();
    expect(latestQueries.length).toEqual(3);
  });

  it("should return 400 for missing/invalid domains", async () => {
    const invalid_domains = ["", "googlecom", "https://google", "123"];
    for (const domain of invalid_domains) {
      const res = await request(server).get(
        `/v1/tools/lookup?domain=${domain}`
      );

      expect(res.statusCode).toBe(400);
      expect(res.body).toMatchObject({
        message: "missing valid domain/url query param",
      });
    }
    const latestQueries = await queryDAL.latest();
    expect(latestQueries.length).toEqual(0);
  });

  it("should return 404 for unkown domains", async () => {
    const res = await request(server).get(
      `/v1/tools/lookup?domain=blahblah.blahblah`
    );

    expect(res.statusCode).toBe(404);
    const latestQueries = await queryDAL.latest();
    expect(latestQueries.length).toEqual(0);
  });
});

describe("POST /validate", () => {
  it("should return 200 for valid ipv4", async () => {
    const valid_ips = ["192.168.1.1", "115.42.150.37", "1.1.1.1"];
    for (const ip of valid_ips) {
      const res = await request(server).post(`/v1/tools/validate`).send({ ip });

      expect(res.statusCode).toBe(200);
    }
  });

  it("should return 400 if ip is not provided in body", async () => {
    const res = await request(server).post(`/v1/tools/validate`).send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({
      message: "ip is required",
    });
  });

  it("should return 400 for invalid ips", async () => {
    const valid_ips = [
      "210.110",
      "123",
      "x.3.4.w",
      "666.10.10.20",
      "33.3333.33.3",
    ];
    for (const ip of valid_ips) {
      const res = await request(server).post(`/v1/tools/validate`).send({ ip });

      expect(res.statusCode).toBe(400);
      expect(res.body).toMatchObject({
        message: "invalid ipv4",
      });
    }
  });
});
