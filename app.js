const express = require("express");
const endpoints = require("./endpoints.json");
const { getTopics } = require("./controllers/topics-controller");
const app = express();

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
