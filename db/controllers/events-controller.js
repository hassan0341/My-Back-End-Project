const {
  fetchEvents,
  addEvent,
  fetchEventsByCreator,
  fetchEventById,
  removeEventById,
  changeEventById,
} = require("../models/events-model");
const { firestore } = require("../../firebase-admin");

exports.postEvent = (req, res, next) => {
  const newEvent = req.body;

  if (process.env.NODE_ENV === "test") {
    const eventWithCreator = { ...newEvent, creator: "mockUsername" };
    addEvent(eventWithCreator)
      .then((event) => {
        res.status(201).send({ event });
      })
      .catch(next);
    return;
  }

  const uid = req.uid;

  firestore
    .collection("Users")
    .doc(uid)
    .get()
    .then((userDoc) => {
      if (!userDoc.exists) {
        return Promise.reject({
          status: 404,
          msg: "User not found in Firestore",
        });
      }

      const username = userDoc.data().username;
      console.log(username);
      const eventWithCreator = { ...newEvent, creator: username };

      return addEvent(eventWithCreator);
    })
    .then((event) => {
      res.status(201).send({ event });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getEvents = (request, response, next) => {
  fetchEvents()
    .then((events) => {
      response.status(200).send({ events });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getEventsByCreator = (req, res, next) => {
  const { creator } = req.params;

  fetchEventsByCreator(creator)
    .then((events) => {
      res.status(200).send({ events });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getEventById = (req, res, next) => {
  const { event_id } = req.params;
  fetchEventById(event_id)
    .then((event) => {
      res.status(200).send({ event });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteEventById = (req, res, next) => {
  const { event_id } = req.params;

  removeEventById(event_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchEventById = (req, res, next) => {
  const { event_id } = req.params;
  const { event_name, venue, image, start_date } = req.body;

  changeEventById(event_id, { event_name, venue, image, start_date })
    .then((updatedEvent) => {
      res.status(200).send({ event: updatedEvent });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
};
