const db = require("../connection");

exports.fetchArticleId = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "error! ID not found" });
      }
      return rows[0];
    });
};

exports.fetchArticles = () => {
  return db
    .query(
      "SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, CAST(COUNT(c.comment_id) AS INT) AS comment_count FROM articles AS a LEFT JOIN comments AS c ON a.article_id = c.article_id GROUP BY a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url ORDER BY created_at desc;"
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      "SELECT c.comment_id, c.votes, c.created_at, c.author, c.body, c.article_id FROM comments AS c WHERE article_id = $1 ORDER BY c.created_at ASC;",
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "error! ID not found" });
      }
    });
};
