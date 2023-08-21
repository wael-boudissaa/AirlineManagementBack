const express = require("express");
const app = express();
const router = express.Router();
const { getFlights } = require("../controllers/flightControllers");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.route("/").get(getFlights);

module.exports = router;
