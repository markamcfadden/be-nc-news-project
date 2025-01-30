const express = require("express");
const {
  deleteCommentByID,
  getCommentsByArticleID,
  postCommentByArticleID,
  updateCommentByID,
} = require("../controllers/comments.controller");

const commentsRouter = express.Router({ mergeParams: true });

commentsRouter.patch("/:comment_id", updateCommentByID);
commentsRouter.get("/", getCommentsByArticleID);
commentsRouter.post("/", postCommentByArticleID);
commentsRouter.delete("/:comment_id", deleteCommentByID);

module.exports = commentsRouter;
