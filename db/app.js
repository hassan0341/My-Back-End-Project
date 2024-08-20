const cors = require("cors");
const express = require("express");
const app = express();

const topicsRouter = require("../routes/topics-router");
const articlesRouter = require("../routes/articles-router");
const usersRouter = require("../routes/users-router");
const commentsRouter = require("../routes/comments-router");
const endpointsRouter = require("../routes/endpoints-router");

app.use(cors());
app.use(express.json());

app.use("/api/topics", topicsRouter);

app.use("/api/articles", articlesRouter);

app.use(`/api/users`, usersRouter);

app.use("/api/comments", commentsRouter);

app.use("/api", endpointsRouter);

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "ERROR! Endpoint Not Found" });
});

app.use((err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  }
  next(err);
});

module.exports = app;
