const { getTopics, postTopic } = require("../db/controllers/topics-controller");
const express = require("express");
const topicsRouter = express.Router();

topicsRouter.get("/", getTopics);
topicsRouter.post("/", postTopic);

module.exports = topicsRouter;
