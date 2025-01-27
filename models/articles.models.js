const db = require("../db/connection");

exports.selectArticles = () => {
  return db
    .query(
      "SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC"
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectArticleByID = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject("article does not exist");
      }
      return rows[0];
    });
};
