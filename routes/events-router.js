const { getEvents, postEvent } = require("../db/controllers/events-controller");
const express = require("express");

const eventsRouter = express.Router();

eventsRouter.get("/", getEvents);
eventsRouter.post("/", postEvent);

module.exports = eventsRouter;
