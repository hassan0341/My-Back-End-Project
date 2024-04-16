const { fetchTopics } = require("../models/model");
const endpointsFile = require("../../endpoints.json");

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
  const endpoints = endpointsFile;
  response.status(200).send({ endpoints });
};
