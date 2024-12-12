const { fetchEvents, addEvent } = require("../models/events-model");
const { firestore } = require("../../firebase-admin");
//console.log("Firestore:", firestore); // Log the Firestore object
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

  console.log("Firestore:", firestore); // This will help you verify if it's correctly initialized
  console.log("Firestore:");

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
      const eventWithCreator = { ...newEvent, creator: username };

      return addEvent(eventWithCreator);
    })
    .then((event) => {
      res.status(201).send({ event });
    })
    .catch((err) => {
      console.log("Error during event creation:", err);
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
