const {
  fetchEvents,
  addEvent,
  fetchEventsByCreator,
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
