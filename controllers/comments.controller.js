const {
  SelectCommentsByArticleID,
  InsertCommentByArticleID,
} = require("../models/comments.models");

exports.getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  return SelectCommentsByArticleID(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  const expectedFields = ["username", "body"];
  const recievedFields = Object.keys(req.body);
  const unexpectedFields = recievedFields.filter(
    (field) => !expectedFields.includes(field)
  );
  if (unexpectedFields.length > 0) {
    return res.status(400).send({ msg: "Bad request, unexpected fields" });
  }

  return InsertCommentByArticleID(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
