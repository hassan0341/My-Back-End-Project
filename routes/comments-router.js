const express = require("express");
const { deleteCommentById } = require("../db/controllers/articles-controller");
const { patchSingleComment } = require("../db/controllers/comments-controller");

const commentsRouter = express.Router();

commentsRouter.delete("/:comment_id", deleteCommentById);
commentsRouter.patch("/:comment_id", patchSingleComment);

module.exports = commentsRouter;
