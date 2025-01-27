const { selectArticleByID } = require("../models/articles.models");

exports.getArticleByID = (req, res, next) => {
  const { article_ID } = req.params;
  return selectArticleByID(article_ID)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
