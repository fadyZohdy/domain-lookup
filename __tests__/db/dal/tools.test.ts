import queryDAL from "../../../src/db/dal/query.dal";
import { initializeDB, dropDB } from "../../helpers";

beforeAll(initializeDB);
afterAll(dropDB);

describe("queryDAL", () => {
  it("should create a query with valid object", async () => {
    const query: Record<string, any> = {
      domain: "test.com",
      client_ip: null,
      addresses: ["1.2.3.4"],
    };
    await queryDAL.create(query);
    const queries = await queryDAL.latest();
    expect(queries.length).toEqual(1);
  });

  it("should not create a query with invalid addresses", async () => {
    let query: Record<string, any> = {
      domain: "test.com",
      client_ip: "1.1.1.1",
      addresses: "1.2.3.4",
    };
    await expect(queryDAL.create(query)).rejects.toThrow(
      "Validation error: Ips should be a non-empty array of string"
    );

    query = {
      domain: "test.com",
      client_ip: "1.1.1.1",
      addresses: [],
    };
    await expect(queryDAL.create(query)).rejects.toThrow(
      "Validation error: Ips should be a non-empty array of string"
    );
  });

  it("should not create a query with null domain", async () => {
    const query: Record<string, any> = {
      domain: null,
      client_ip: "1.1.1.1",
      addresses: ["1.2.3.4"],
    };
    await expect(queryDAL.create(query)).rejects.toThrow(
      "notNull Violation: Query.domain cannot be null"
    );
  });
});
