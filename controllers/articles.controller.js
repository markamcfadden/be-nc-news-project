const {
  selectArticles,
  selectArticleByID,
  patchArticleByID,
  insertArticle,
  removeArticleAndCommentsByID,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  return selectArticles(req.query)
    .then((articlesData) => {
      res.status(200).send({
        articles: articlesData.articles,
        total_count: articlesData.total_count,
        limit: articlesData.limit,
        page: articlesData.page,
      });
    })
    .catch(next);
};

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  return selectArticleByID(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  return patchArticleByID(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;
  return insertArticle(author, title, body, topic, article_img_url)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.deleteArticleAndCommentsByID = (req, res, next) => {
  const { article_id } = req.params;
  return removeArticleAndCommentsByID(article_id)
    .then(() => {
      return res.status(204).send();
    })
    .catch(next);
};
