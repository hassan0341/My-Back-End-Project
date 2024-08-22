const db = require("../connection");

exports.fetchArticleId = (article_id) => {
  return db
    .query(
      `SELECT *, (SELECT CAST(COUNT(*) AS INT) FROM comments WHERE article_id = $1) AS comment_count FROM articles WHERE article_id = $1;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "error! ID not found" });
      }
      return rows[0];
    });
};

exports.fetchArticles = (topic, limit, offset) => {
  let queryStr = `
    SELECT 
      a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, 
      COUNT(*) OVER() AS total_count, 
      CAST(COUNT(c.comment_id) AS INT) AS comment_count 
    FROM 
      articles a 
    LEFT JOIN 
      comments c 
    ON 
      a.article_id = c.article_id`;

  const queryVal = [];

  if (topic) {
    queryStr += ` WHERE topic = $1`;
    queryVal.push(topic);
  }

  queryStr += `
    GROUP BY a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url 
    ORDER BY a.created_at DESC 
    LIMIT $${queryVal.length + 1}
    OFFSET $${queryVal.length + 2}
    `;

  queryVal.push(limit);
  queryVal.push(offset);

  return db.query(queryStr, queryVal).then(({ rows }) => {
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

exports.checkTopicExists = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "ERROR! Topic not found!" });
      }
    });
};

exports.insertComment = (article_id, newComment) => {
  const { body, username } = newComment;

  if ((!body, !username)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request! Missing required fields",
    });
  }

  return db
    .query(
      "INSERT INTO comments (article_id, body, author) VALUES ($1, $2, $3) RETURNING *",
      [article_id, body, username]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.changeArticleById = (article_id, inc_votes) => {
  if (inc_votes === undefined) {
    return Promise.reject({
      status: 400,
      msg: "ERROR! Missing required data",
    });
  }

  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "ID does not exist" });
      }
      return rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `ERROR! this comment doesn't exist`,
        });
      }
      return rows[0];
    });
};

exports.addArticles = (newArticle) => {
  const { author, title, body, topic, article_img_url } = newArticle;

  return db
    .query(
      `INSERT INTO articles (author, title, body, topic, article_img_url, votes, created_at) VALUES ($1, $2, $3, $4, $5, 0, NOW()) RETURNING *,
      (SELECT COUNT(*)::int FROM comments WHERE comments.article_id = articles.article_id) AS comment_count
      `,
      [
        author,
        title,
        body,
        topic,
        article_img_url ||
          "https://www.istockphoto.com/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration-gm1396814518-451440720",
      ]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
