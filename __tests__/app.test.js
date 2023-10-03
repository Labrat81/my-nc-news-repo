const { app } = require("../db/app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpointsJson = require("../endpoints.json");

const db = require("../db/connection");
beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET: /api/topics", () => {
  test("should respond with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((result) => {
        expect(result.body.topics.length).toBe(3);
        result.body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
  test("should respond with an object that describes all available endpoints on api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => { console.log(response)
        const { endpoints } = response.body;
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
