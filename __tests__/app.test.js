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
});
describe("GET: /api", () => {
  test("should respond with an object that describes all available endpoints on api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const { endpoints } = response.body;
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
describe("GET: /api/articles/:article_id", () => {
  test("should respond with an object of the id of a given articles endpoint", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article.article_id).toBe(1);
        expect(response.body.article).toHaveProperty(
          "title",
          expect.any(String)
        );
        expect(response.body.article).toHaveProperty(
          "topic",
          expect.any(String)
        );
        expect(response.body.article).toHaveProperty(
          "author",
          expect.any(String)
        );
        expect(response.body.article).toHaveProperty(
          "body",
          expect.any(String)
        );
        expect(response.body.article).toHaveProperty(
          "created_at",
          expect.any(String)
        );
        expect(response.body.article).toHaveProperty(
          "votes",
          expect.any(Number)
        );
        expect(response.body.article).toHaveProperty(
          "article_img_url",
          expect.any(String)
        );
      });
  });
  test("GET:404 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
});
describe("GET: /api/articles", () => {
  test("should respond with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(13);
        response.body.articles.forEach((article) => {
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(String));
        });
      });
  });
  test("should respond with an array which is sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((result) => {
        expect(result.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});
describe("GET: /api/articles/:article_id/comments", () => {
  test("should respond with an array of article comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(11);
        response.body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment.article_id).toBe(1);
        });
      });
  });
  test("should respond with an array which is sorted by comments in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((result) => {
        expect(result.body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET:404 should send an appropriate status and error message when passed an id that is valid but does not exist", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
      });
  });
  test("GET:200 should respond with an empty array if there are no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toEqual([]);
      });
  });
  test("should respond with an appropriate status and error message when passed an invalid id", () => {
    return request(app)
      .get("/api/articles/abc/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
});
describe("POST: /api/articles/:article_id/comments", () => {
  test("201: should respond with an object with a single posted comment", () => {
    const newComment = {
      article_id: 1,
      author: "butter_bridge",
      body: "story of my life",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        console.log(response.body, "new comment");
        expect(response.body.comments.article_id).toBe(1);
        expect(response.body.comments.author).toBe("butter_bridge");
        expect(response.body.comments.body).toBe("story of my life");
      });
  });
  test("POST:400 should respond with an appropriate status and error message when posting to an invalid id", () => {
    const newComment = {
      article_id: "abc",
      author: "butter_bridge",
      body: "story of my life",
    };
    return request(app)
      .post("/api/articles/abc/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
  test("POST:400 should respond with an appropriate status and error message when provided with an invalid comment (no username)", () => {
    const newComment = {
      article_id: 1,
      body: "story of my life",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
  test("POST:404 should send an appropriate status and error message when posting to an article id that is valid but does not exist", () => {
    const newComment = {
      article_id: 999,
      author: "butter_bridge",
      body: "story of my life",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article does not exist");
      });
  });
});
