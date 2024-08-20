const endPoints = require("../../endpoints.json");

exports.getEndpoints = (request, response, next) => {
  const endpoints = endPoints;
  response.status(200).send({ endpoints });
};
