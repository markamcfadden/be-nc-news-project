const db = require("../db/connection");
const {
  checkArticleIDExists,
  convertTimestampToDate,
  checkUsernameExists,
} = require("../db/seeds/utils");

exports.selectCommentsByArticleID = (article_id) => {
  return checkArticleIDExists(article_id)
    .then(() => {
      return db.query(
        `SELECT * FROM comments 
        WHERE article_id =$1
        ORDER BY created_at DESC`,
        [article_id]
      );
    })
    .then(({ rows }) => {
      return rows.map(convertTimestampToDate);
    });
};

exports.insertCommentByArticleID = (article_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "Bad request, missing required fields",
    });
  }

  if (typeof username !== "string" || typeof body !== "string") {
    return Promise.reject({
      status: 400,
      msg: "Bad request, invalid data type",
    });
  }

  return Promise.all([
    checkArticleIDExists(article_id),
    checkUsernameExists(username),
  ]).then(() => {
    return db
      .query(
        `INSERT INTO comments (body, article_id, author, votes)
        VALUES ($1, $2, $3, 0)
        RETURNING *;`,
        [body, article_id, username]
      )
      .then(({ rows }) => {
        return rows.map(convertTimestampToDate);
      });
  });
};
