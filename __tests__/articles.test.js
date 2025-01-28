const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/articles/:article_id", () => {
  test("200: responds with article requested", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toMatchObject({
          article_id: 3,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("404: responds with an error message when given a valid but non-existent article id", () => {
    return request(app)
      .get("/api/articles/600")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article id does not exist");
      });
  });
  test("400: responds with error message when given an invalid article name", () => {
    return request(app)
      .get("/api/articles/ducks")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an object with an array of all the article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("200: should return the array of article objects sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: should return an updated article with the votes property adjusted accordingly", () => {
    const votesToAdd = { inc_votes: 15 };
    return request(app)
      .patch("/api/articles/1")
      .send(votesToAdd)
      .expect(200)
      .then(({ body }) => {
        const updatedArticle = body.updatedArticle[0];
        expect(updatedArticle).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 115,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("404: should return an error if article_id does not exist", () => {
    const votesToAdd = { inc_votes: 15 };
    return request(app)
      .patch("/api/articles/100")
      .send(votesToAdd)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article id does not exist");
      });
  });
  test("400: should return an error if a non numeric data type is given", () => {
    const votesToAdd = { inc_votes: "fifteen" };
    return request(app)
      .patch("/api/articles/1")
      .send(votesToAdd)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, invalid data type");
      });
  });
  test("400: return an error if there is a missing field", () => {
    const votesToAdd = {};
    return request(app)
      .patch("/api/articles/1")
      .send(votesToAdd)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, missing required fields");
      });
  });
  test("400: should return an error if there are unexpected field", () => {
    const votesToAdd = { inc_votes: 15, username: "butter_bridge" };
    return request(app)
      .patch("/api/articles/1")
      .send(votesToAdd)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, unexpected fields");
      });
  });
});
