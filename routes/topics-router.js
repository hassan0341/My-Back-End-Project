const { getTopics } = require("../db/controllers/topics-controller");
const express = require("express");
const topicsRouter = express.Router();

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
