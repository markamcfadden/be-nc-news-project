const {
  selectArticles,
  selectArticleByID,
  patchArticleByID,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  return selectArticles(req.query)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
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

  return patchArticleByID(article_ID, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};
