const db = require("../connection");
const endPoints = require("../../endpoints.json");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.fetchEndpoint = () => {
  return endPoints;
};
