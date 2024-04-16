const { fetchTopics } = require("../models/topics-model");
const endPoints = require("../../endpoints.json");

exports.getTopics = (request, response, next) => {
  fetchTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getEndpoints = (request, response, next) => {
  const endpoints = endPoints;
  response.status(200).send({ endpoints });
};
