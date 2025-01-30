const express = require("express");
const {
  deleteCommentByID,
  getCommentsByArticleID,
  postCommentByArticleID,
} = require("../controllers/comments.controller");

const commentsRouter = express.Router({ mergeParams: true });

commentsRouter.get("/", getCommentsByArticleID);
commentsRouter.post("/", postCommentByArticleID);
commentsRouter.delete("/:comment_id", deleteCommentByID);

module.exports = commentsRouter;
