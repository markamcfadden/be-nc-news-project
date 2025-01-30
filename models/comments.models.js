const db = require("../db/connection");
const {
  checkArticleIDExists,
  convertTimestampToDate,
  checkUsernameExists,
  checkCommentExists,
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

exports.removeCommentByID = (comment_id) => {
  return checkCommentExists(comment_id).then(() => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id]);
  });
};

exports.patchCommentByID = (comment_id, votesToAdd) => {
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

  return checkCommentExists(comment_id).then(() => {
    return db
      .query(
        `UPDATE comments SET votes = GREATEST(votes + $1, 0) WHERE comment_id =$2 RETURNING *`,
        [votesToAdd, comment_id]
      )
      .then(({ rows }) => {
        return rows.map(convertTimestampToDate);
      });
  });
};
