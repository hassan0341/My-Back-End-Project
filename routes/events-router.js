const {
  getEvents,
  postEvent,
  getEventsByCreator,
  getEventById,
} = require("../db/controllers/events-controller");
const express = require("express");
const verifyFirebaseToken = require("../db/middleware/verifyFirebaseToken");

const eventsRouter = express.Router();

eventsRouter.get("/", getEvents);
eventsRouter.post("/", verifyFirebaseToken, postEvent);
eventsRouter.get("/creator/:creator", verifyFirebaseToken, getEventsByCreator);
eventsRouter.get("/:event_id", getEventById);

module.exports = eventsRouter;
