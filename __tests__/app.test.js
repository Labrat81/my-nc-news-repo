const { app } = require("../db/app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpointsJson = require("../endpoints.json");

const db = require("../db/connection");
beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET: /api", () => {
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
      .then((response) => {
        const { endpoints } = response.body;
        expect(endpoints).toEqual(endpointsJson);
      });
  });

  test("should respond with an object of the id of a given endpoint", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
          expect(response.body.article).toHaveProperty('article_id', expect.any(Number));
          expect(response.body.article).toHaveProperty('title', expect.any(String));
          expect(response.body.article).toHaveProperty('topic', expect.any(String));
          expect(response.body.article).toHaveProperty('author', expect.any(String));
          expect(response.body.article).toHaveProperty('body', expect.any(String));
          expect(response.body.article).toHaveProperty('created_at', expect.any(String));
          expect(response.body.article).toHaveProperty('votes', expect.any(Number));
          expect(response.body.article).toHaveProperty('article_img_url', expect.any(String));
      });
  });
  test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
    return request(app)
      .get('/api/articles/999')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('article does not exist');
      });
  });
  test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
    return request(app)
      .get('/api/articles/not-an-article')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('bad request');
      });
  });
});

