const express = require("express");
const {
  getArticles,
  patchArticleById,
  postCommentByArticleId,
  getCommentsByArticleId,
  getSingleArticle,
  postArticles,
  deleteSingleArticle,
} = require("../db/controllers/articles-controller");

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getSingleArticle);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);
articlesRouter.post("/:article_id/comments", postCommentByArticleId);
articlesRouter.patch("/:article_id", patchArticleById);
articlesRouter.post("/", postArticles);
articlesRouter.delete("/:article_id", deleteSingleArticle);

module.exports = articlesRouter;
