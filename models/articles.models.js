const db = require("../db/connection");

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
