const { response } = require("../app");
const {
  fetchArticleId,
  fetchArticles,
  fetchCommentsByArticleId,
  checkArticleExists,
  insertComment,
  changeArticleById,
  removeCommentById,
  checkTopicExists,
  addArticles,
} = require("../models/articles-model");

exports.getSingleArticle = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleId(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (request, response, next) => {
  const { topic, limit = 10, p = 1 } = request.query;

  const offset = (p - 1) * limit;

  const articlePromise = fetchArticles(topic, limit, offset);
  const topicPromise = topic ? checkTopicExists(topic) : Promise.resolve();

  Promise.all([articlePromise, topicPromise])
    .then(([articles]) => {
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  Promise.all([
    fetchCommentsByArticleId(article_id),
    checkArticleExists(article_id),
  ])
    .then(([comments]) => {
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  const newComment = request.body;
  insertComment(article_id, newComment)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;

  changeArticleById(article_id, inc_votes)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  removeCommentById(comment_id)
    .then(() => {
      response.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticles = (req, res, next) => {
  const newArticle = req.body;
  addArticles(newArticle)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
