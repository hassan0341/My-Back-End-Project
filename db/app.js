const express = require("express");
const app = express();
const { getTopics, getEndpoints } = require("./controllers/topics-controller");
const { getArticles } = require("./controllers/articles-controller");

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticles);

app.get("/api", getEndpoints);

app.use(express.json());

app.use((err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  }
});

app.use((request, response, next) => {
  response.status(404).send({ msg: "ERROR! Endpoint Not Found" });
});

module.exports = app;
