const express = require("express");
const { getUsers, getUserByID } = require("../controllers/users-controller");

const usersRouter = express.Router();

usersRouter.get("/", getUsers);
usersRouter.get("/:username", getUserByID);

module.exports = usersRouter;
