const db = require("../db/connection.js");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.insertTopic = (slug, description) => {
  if (!slug || !description) {
    return Promise.reject({
      status: 400,
      msg: "Bad request, missing required fields",
    });
  }
  if (typeof slug !== "string" || typeof description !== "string") {
    return Promise.reject({
      status: 400,
      msg: "Bad request, invalid data type",
    });
  }

  return db
    .query(
      `INSERT into topics (slug, description)
    VALUES ($1, $2) RETURNING *`,
      [slug, description]
    )
    .then(({ rows }) => {
      return rows;
    });
};
