const express = require("express");
const { deleteCommentById } = require("../db/controllers/articles-controller");

const commentsRouter = express.Router();

commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;
