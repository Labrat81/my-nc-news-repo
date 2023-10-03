const express = require("express");
const { getTopics, getApi } = require("../controllers/nc-news-controller");

const app = express();

app.get("/api/topics", getTopics);

app.get('/api', getApi)

module.exports = {app};
