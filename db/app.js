const cors = require("cors");
const express = require("express");
const app = express();
const { getTopics, getEndpoints } = require("./controllers/topics-controller");
const {
  getSingleArticle,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
  deleteCommentById,
} = require("./controllers/articles-controller");
const { getUsers } = require("./controllers/users-controller");

app.use(cors());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getSingleArticle);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.get("/api", getEndpoints);

app.get(`/api/users`, getUsers);

app.use(express.json());

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteCommentById);

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
