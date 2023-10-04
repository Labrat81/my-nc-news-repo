const {
  selectTopics,
  selectArticleById,
  selectArticle,
} = require("../models/topics-model");
const endpoints = require("../endpoints.json");

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
    selectArticle().then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    })
};
