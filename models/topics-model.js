const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "article does not exist",
        });
      }
      return article;
    });
};

exports.selectArticle = () => {
  return db
    .query(
      `
  SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
  COUNT (comments.comment_id) 
  AS comment_count
  FROM articles
  LEFT OUTER JOIN comments
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at
  DESC;
  `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id
      FROM comments 
      LEFT OUTER JOIN articles
      ON comments.article_id = articles.article_id
      WHERE comments.article_id = $1
      GROUP BY comments.comment_id
      ORDER BY comments.created_at
      DESC;  
      `,
      [article_id]
    )
    .then(({rows}) => {
      const comment = rows;
      
      return comment;
    });
};
