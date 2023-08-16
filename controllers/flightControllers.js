const express = require("express");
const asyncHandler = require("express-async-handler");
const app = express();
const getFlights = asyncHandler(async (req, res) => {});
module.exports = { getFlights };
