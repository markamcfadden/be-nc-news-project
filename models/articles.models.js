const db = require("../db/connection");
const {
  checkArticleIDExists,
  convertTimestampToDate,
  checkUsernameExists,
  checkTopicExists,
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

exports.selectArticleByID = (article_id) => {
  return checkArticleIDExists(article_id)
    .then(() => {
      return db.query(
        `SELECT
        articles.article_id,
        articles.title,
        articles.topic,
        articles.author,
        articles.body,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.article_id)::INTEGER as comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id`,
        [article_id]
      );
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
        `UPDATE articles SET votes = GREATEST(votes + $1, 0) WHERE article_id = $2 RETURNING *`,
        [votesToAdd, article_id]
      )
      .then(({ rows }) => {
        return rows.map(convertTimestampToDate);
      });
  });
};

exports.insertArticle = (author, title, body, topic, article_img_url) => {
  if (!author || !title || !body || !topic) {
    return Promise.reject({
      status: 400,
      msg: "Bad request, missing required field",
    });
  }

  const img_url =
    article_img_url ||
    "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700";

  if (
    typeof author !== "string" ||
    typeof title !== "string" ||
    typeof body !== "string" ||
    typeof topic !== "string" ||
    typeof img_url !== "string"
  ) {
    return Promise.reject({
      status: 400,
      msg: "Bad request, invalid data type",
    });
  }

  return Promise.all([
    checkUsernameExists(author),
    checkTopicExists(topic),
  ]).then(() => {
    return db
      .query(
        `INSERT INTO articles (title, topic, author, body, article_img_url)
  VALUES ($1, $2, $3, $4, $5) RETURNING article_id;`,
        [title, topic, author, body, img_url]
      )
      .then(({ rows }) => {
        const { article_id } = rows[0];
        return exports.selectArticleByID(article_id);
      })
      .then((article) => {
        return article;
      });
  });
};
