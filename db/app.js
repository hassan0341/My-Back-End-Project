const express = require("express");
const app = express();
const { getTopics } = require("../db/controllers/controller");

app.get("/api/topics", getTopics);

app.use((request, response, next) => {
  response.status(404).send({ msg: "ERROR! Endpoint Not Found" });
});

module.exports = app;
