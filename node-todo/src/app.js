const express = require("express");
const todoRoute = require("./routers/todoRoute");

const app = express();

app.use(express.json(), todoRoute);

module.exports = app;
