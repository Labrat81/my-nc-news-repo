const express = require("express");
const {
  getTopics,
  getApi,
  getArticleById,
  getArticles,
  getComments
} = require("../controllers/nc-news-controller");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
}); //custom

app.use((err, req, res, next) => {
  if (err.code === "23502" || err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
});//400

app.use((err, req, res, next) => {
  res.status(500).send({ msg: `internal server error: ${err}` });
  next(err);
});//server

module.exports = { app };
