const { fetchTopics, addTopic } = require("../models/topics-model");

exports.getTopics = (request, response, next) => {
  fetchTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postTopic = (req, res, next) => {
  const newComment = req.body;
  addTopic(newComment)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};
