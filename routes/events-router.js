const { getEvents, postEvent } = require("../db/controllers/events-controller");
const express = require("express");
const verifyFirebaseToken = require("../db/middleware/verifyFirebaseToken");

const eventsRouter = express.Router();

eventsRouter.get("/", getEvents);
eventsRouter.post("/", verifyFirebaseToken, postEvent);

module.exports = eventsRouter;
