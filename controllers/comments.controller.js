const {
  selectCommentsByArticleID,
  insertCommentByArticleID,
  removeCommentByID,
  patchCommentByID,
} = require("../models/comments.models");

exports.getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  return selectCommentsByArticleID(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  return insertCommentByArticleID(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentByID = (req, res, next) => {
  const { comment_id } = req.params;
  return removeCommentByID(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.updateCommentByID = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  return patchCommentByID(comment_id, inc_votes)
    .then((updatedComment) => {
      res.status(200).send({ updatedComment });
    })
    .catch(next);
};
