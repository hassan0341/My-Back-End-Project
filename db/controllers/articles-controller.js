const {
  fetchArticleId,
  fetchArticles,
  fetchCommentsByArticleId,
  checkArticleExists,
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
  fetchArticles().then((articles) => {
    response.status(200).send({ articles });
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
