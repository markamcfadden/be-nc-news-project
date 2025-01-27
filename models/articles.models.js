const db = require("../db/connection");
const {
  checkArticleIDExists,
  convertTimestampToDate,
} = require("../db/seeds/utils");

exports.selectArticles = () => {
  return db
    .query(
      `SELECT 
      articles.article_id, 
      title, 
      topic, 
      articles.author, 
      TO_CHAR(articles.created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at,
      articles.votes, 
      article_img_url, 
      COUNT(comments.article_id) AS comment_count 
      FROM articles 
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id 
      GROUP BY articles.article_id ORDER BY created_at DESC`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectArticleByID = (id) => {
  return checkArticleIDExists(id)
    .then(() => {
      return db.query("SELECT * FROM articles WHERE article_id = $1", [id]);
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.patchArticleByID = (article_id, votesToAdd) => {
  if (!votesToAdd) {
    return Promise.reject({
      status: 400,
      msg: "Bad request, missing required fields",
    });
  }

  if (typeof votesToAdd !== "number") {
    return Promise.reject({
      status: 400,
      msg: "Bad request, invalid data type",
    });
  }

  return checkArticleIDExists(article_id).then(() => {
    return db
      .query(
        `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
        [votesToAdd, article_id]
      )
      .then(({ rows }) => {
        return rows.map(convertTimestampToDate);
      });
  });
};
