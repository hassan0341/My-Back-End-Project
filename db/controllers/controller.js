const { fetchTopics, fetchEndpoint } = require("../models/model");

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
  const endpoint = fetchEndpoint();
  response.status(200).send({ endpoint });
};
