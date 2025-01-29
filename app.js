const express = require("express");
const { getEndpoints } = require("./controllers/api-controller");
const { getTopics } = require("./controllers/topics-controller");
const {
  getCommentsByArticleID,
  postCommentByArticleID,
  deleteCommentByID,
} = require("./controllers/comments.controller");
const {
  getArticles,
  getArticleByID,
  updateArticleByID,
} = require("./controllers/articles.controller");
const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_ID", getArticleByID);

app.patch("/api/articles/:article_ID", updateArticleByID);

app.get("/api/articles/:article_id/comments", getCommentsByArticleID);

app.post("/api/articles/:article_id/comments", postCommentByArticleID);

app.delete("/api/comments/:comment_id", deleteCommentByID);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log("error not handled yet");
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
