const db = require("../connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.addTopic = (newTopic) => {
  const { slug, description } = newTopic;

  if (typeof slug !== "string" || typeof description !== "string") {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(
      "INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;",
      [slug, description]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
