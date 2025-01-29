const db = require("../db/connection");
const {
  checkArticleIDExists,
  convertTimestampToDate,
} = require("../db/seeds/utils");

exports.selectArticles = (queries) => {
  const sort_by = queries.sort_by || "created_at";
  const order = queries.order || "desc";
  const topic = queries.topic;

  let sqlString = `SELECT 
      articles.article_id, 
      title, 
      topic, 
      articles.author, 
      articles.created_at,
      articles.votes, 
      article_img_url, 
      COUNT(comments.article_id)::INTEGER AS comment_count 
      FROM articles 
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id`;

  let args = [];

  if (topic) {
    sqlString += " WHERE topic = $1";
    args.push(topic);
  }

  if (sort_by) {
    const greenList = [
      "created_at",
      "article_id",
      "title",
      "topic",
      "author",
      "votes",
      "comment_count",
    ];
    if (!greenList.includes(sort_by)) {
      return Promise.reject({ status: 400, msg: "Invalid sorting query" });
    }
  }
  sqlString += ` GROUP BY articles.article_id`;
  sqlString += ` ORDER BY ${sort_by}`;

  if (order === "asc" || order === "desc") {
    sqlString += " " + order;
  } else {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  return db.query(sqlString, args).then(({ rows }) => {
    return rows.map(convertTimestampToDate);
  });
};

exports.selectArticleByID = (id) => {
  return checkArticleIDExists(id)
    .then(() => {
      return db.query("SELECT * FROM articles WHERE article_id = $1", [id]);
    })
    .then(({ rows }) => {
      rows.map(convertTimestampToDate);
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
