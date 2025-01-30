const db = require("../db/connection");
const { checkUsernameExists } = require("../db/seeds/utils");

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};

exports.selectUserByUsername = (username) => {
  return checkUsernameExists(username).then(() => {
    return db
      .query(`SELECT * FROM users WHERE username = $1`, [username])
      .then(({ rows }) => {
        return rows[0];
      });
  });
};
