const db = require("../db/connection");
const {
  checkArticleIDExists,
  convertTimestampToDate,
} = require("../db/seeds/utils");

exports.SelectCommentsByArticleID = (article_id) => {
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
