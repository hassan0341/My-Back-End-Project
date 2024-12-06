const { fetchEvents, addEvent } = require("../models/events-model");

exports.getEvents = (request, response, next) => {
  fetchEvents()
    .then((events) => {
      response.status(200).send({ events });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postEvent = (req, res, next) => {
  const newEvent = req.body;

  addEvent(newEvent)
    .then((event) => {
      res.status(201).send({ event });
    })
    .catch((err) => {
      next(err);
    });
};
