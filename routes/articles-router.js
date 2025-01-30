const express = require("express");
const {
  getArticles,
  getArticleByID,
  updateArticleByID,
  postArticle,
} = require("../controllers/articles.controller");
const commentsRouter = require("./comments-router");

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.post("/", postArticle);
articlesRouter.get("/:article_id", getArticleByID);
articlesRouter.patch("/:article_id", updateArticleByID);

articlesRouter.use("/:article_id/comments", commentsRouter);

module.exports = articlesRouter;
