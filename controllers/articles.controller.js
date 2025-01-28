const {
  selectArticles,
  selectArticleByID,
  patchArticleByID,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  return selectArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getArticleByID = (req, res, next) => {
  const { article_ID } = req.params;
  return selectArticleByID(article_ID)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticleByID = (req, res, next) => {
  const { article_ID } = req.params;
  const { inc_votes } = req.body;

  const expectedFields = ["inc_votes"];
  const recievedFields = Object.keys(req.body);
  const unexpectedFields = recievedFields.filter(
    (field) => !expectedFields.includes(field)
  );
  if (unexpectedFields.length > 0) {
    return res.status(400).send({ msg: "Bad request, unexpected fields" });
  }

  return patchArticleByID(article_ID, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};
