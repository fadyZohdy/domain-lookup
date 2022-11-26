import request from "supertest";
import { Express } from "express";

import createServer from "../../src/utils/server";
import { initializeDB, dropDB } from "../helpers";
import queryDAL from "../../src/db/dal/query.dal";

let server: Express;

beforeAll(async () => {
  server = await createServer();
  await initializeDB();
});
beforeEach(queryDAL.truncate);
afterAll(dropDB);

describe("GET /", () => {
  it("should return correct info", async () => {
    const res = await request(server).get(`/`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ kubernetes: false });
    expect(res.body.version).toBeDefined;
    expect(res.body.date).toBeDefined;
    expect(typeof res.body.date).toBe("number");
  });
});

describe("GET /health", () => {
  it("should return 200", async () => {
    const res = await request(server).get(`/health`);

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /metrics", () => {
  it("should expose prometheus metrics", async () => {
    const res = await request(server).get(`/metrics`);

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /history", () => {
  it("should return empty array if no queries were issues", async () => {
    const res = await request(server).get(`/history`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toEqual(0);
  });

  it("should return latest issued queries", async () => {
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
    const res = await request(server).get(`/history`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toEqual(3);
  });
});
