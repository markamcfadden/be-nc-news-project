const express = require("express");
const { getEndpoints } = require("./controllers/api-controller");
const { getTopics } = require("./controllers/topics-controller");
const app = express();

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
