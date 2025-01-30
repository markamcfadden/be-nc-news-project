const endpointsJson = require("../endpoints.json");
const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with an object with an array of all the user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(users.length).toBe(4);
      });
  });

  test("should return user objects with wanted keys and correct data type as each value", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("404: responds with an error message if a non-existent path is requested", () => {
    return request(app)
      .get("/api/userz")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: responds with the user requested", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const user = body.user;
        expect(user).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
  test("404: returns an error if username does not exist", () => {
    return request(app)
      .get("/api/users/mcflurryoreos")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("username does not exist");
      });
  });
});

describe("GET /api/topics", () => {
  test("200: responds with an object with an array of all the topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(topics.length).toBe(3);
      });
  });

  test("should return topic objects with wanted keys and correct data type as each value", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("404: responds with an error message if a non-existent path is requested", () => {
    return request(app)
      .get("/api/topicz")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with article requested", () => {
    return request(app)
      .get("/api/articles/9")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toMatchObject({
          article_id: 9,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: 2,
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
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("200: should return the array of article objects sorted by date in descending order when there are no queries", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: should return the articles in ascending order when given query but still sorted by date by default", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("created_at");
      });
  });
  test("200: should return the articles sorted by article_id when queried", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("article_id", { descending: true });
      });
  });
  test("200: should return the articles sorted by title when queried", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("200: should return the articles sorted by topic when queried", () => {
    return request(app)
      .get("/api/articles?sort_by=topic")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("topic", { descending: true });
      });
  });
  test("200: should return the articles sorted by author when queried", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("author", { descending: true });
      });
  });
  test("200: should return the articles sorted by votes when queried", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });
  test("200: should return the articles sorted by comment_count and in ascending order when queried", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count&order=asc")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("comment_count");
      });
  });
  test("400: shold return an error when given an invalid sorting query", () => {
    return request(app)
      .get("/api/articles?sort_by=awards")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sorting query");
      });
  });
  test("400: shold return an error when given an invalid order query", () => {
    return request(app)
      .get("/api/articles?order=most")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order query");
      });
  });
  test("200: should return all articles matching the topic query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(12);
      });
  });
  test("200: should return an empty array if the topic is valid but no articles match the topic", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(0);
      });
  });
  test("400: should return an error if the topic is invalid", () => {
    return request(app)
      .get("/api/articles/golf")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

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
  test("201: should return the posted comment and ignore unwanted/additional fields", () => {
    const newComment = {
      username: "butter_bridge",
      age: 23,
      body: "gripping read",
    };
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
  test("200: should return an updated article with the votes property adjusted accordingly even if other fields are present", () => {
    const votesToAdd = { inc_votes: 15, username: "butter_bridge" };
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
  test("200: should return an article with the votes no lower than zero regardless of the negative number given", () => {
    const votesToAdd = { inc_votes: -200 };
    return request(app)
      .patch("/api/articles/1")
      .send(votesToAdd)
      .expect(200)
      .then(({ body }) => {
        const updatedArticle = body.updatedArticle[0];
        expect(updatedArticle.votes).toBe(0);
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: should successfully delete given comment", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("404: should return an error if the comment is not found", () => {
    return request(app)
      .delete("/api/comments/19")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment does not exist");
      });
  });
  test("400: should return an error if given an invalid input", () => {
    return request(app)
      .delete("/api/comments/ducks")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: should return an updated comment object with the votes property adjusted accordingly", () => {
    const votesToAdd = { inc_votes: 12 };
    return request(app)
      .patch("/api/comments/1")
      .send(votesToAdd)
      .expect(200)
      .then(({ body }) => {
        const updatedComment = body.updatedComment[0];
        expect(updatedComment).toMatchObject({
          created_at: "2020-04-06T12:17:00.000Z",
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          article_id: 9,
          author: "butter_bridge",
          votes: 28,
        });
      });
  });
  test("200: should return an updated comment object with the votes property adjusted accordingly if votes is a negative number", () => {
    const votesToAdd = { inc_votes: -12 };
    return request(app)
      .patch("/api/comments/1")
      .send(votesToAdd)
      .expect(200)
      .then(({ body }) => {
        const updatedComment = body.updatedComment[0];
        expect(updatedComment).toMatchObject({
          created_at: "2020-04-06T12:17:00.000Z",
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          article_id: 9,
          author: "butter_bridge",
          votes: 4,
        });
      });
  });
  test("400: should return an error if there is a missing required field", () => {
    const votesToAdd = {};
    return request(app)
      .patch("/api/comments/1")
      .send(votesToAdd)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, missing required fields");
      });
  });
  test("400: should return an error if the wrong data type is given", () => {
    const votesToAdd = { inc_votes: "twelve" };
    return request(app)
      .patch("/api/comments/1")
      .send(votesToAdd)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, invalid data type");
      });
  });
  test("404: should return an error if the comment does not exist", () => {
    const votesToAdd = { inc_votes: 12 };
    return request(app)
      .patch("/api/comments/88")
      .send(votesToAdd)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment does not exist");
      });
  });
  test("200: should return a votes property no lower than 0 even if negative number is more than current votes", () => {
    const votesToAdd = { inc_votes: -175 };
    return request(app)
      .patch("/api/comments/1")
      .send(votesToAdd)
      .expect(200)
      .then(({ body }) => {
        const updatedComment = body.updatedComment[0];
        expect(updatedComment.votes).toBe(0);
      });
  });
});
