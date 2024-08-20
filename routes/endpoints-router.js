const { getEndpoints } = require("../db/controllers/endpoints-controller");

const express = require("express");
const endpointsRouter = express.Router();

endpointsRouter.get("/", getEndpoints);

module.exports = endpointsRouter;
