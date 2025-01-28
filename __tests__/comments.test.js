const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/articles/:article_id/comments", () => {
  test("200: should return an object with an array of comments for the given article id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: should return an object with an empty array if the article id exists but there are no comments ", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments.length).toBe(0);
      });
  });
  test("404: should return an error if the article_id does not exist", () => {
    return request(app)
      .get("/api/articles/50/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article id does not exist");
      });
  });
  test("400: should return an error if article_id is not valid", () => {
    return request(app)
      .get("/api/articles/thefunnyone/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: should return the posted comment", () => {
    const newComment = { username: "butter_bridge", body: "gripping read" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment[0];
        expect(comment).toMatchObject({
          comment_id: 19,
          body: "gripping read",
          article_id: 2,
          author: "butter_bridge",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("400: should return an error if username is missing ", () => {
    const newComment = { body: "gripping read" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, missing required fields");
      });
  });
  test("400: should return an error if body is missing", () => {
    const newComment = { username: "butter_bridge" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, missing required fields");
      });
  });
  test("400: should return an error if the username is not a string", () => {
    const newComment = { username: 1223, body: "gripping read" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) =>
        expect(body.msg).toBe("Bad request, invalid data type")
      );
  });
  test("400: should return an error if the body is not a string", () => {
    const newComment = { username: "butter_bridge", body: true };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) =>
        expect(body.msg).toBe("Bad request, invalid data type")
      );
  });
  test("404: should return error if article id does not exist", () => {
    const newComment = { username: "butter_bridge", body: "gripping read" };
    return request(app)
      .post("/api/articles/500/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => expect(body.msg).toBe("article id does not exist"));
  });
  test("404: should return error if username does not exist", () => {
    const newComment = { username: "mcflurryoreos", body: "gripping read" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("username does not exist");
      });
  });
  test("400: should return an error if invalid data type for article_id is entered", () => {
    const newComment = { username: "butter_bridge", body: "gripping read" };
    return request(app)
      .post("/api/articles/ducks/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: should return an error if body has unexpected fields", () => {
    const newComment = {
      username: "butter_bridge",
      age: 23,
      body: "gripping read",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, unexpected fields");
      });
  });
});
