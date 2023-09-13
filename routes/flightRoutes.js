const express = require("express");
const app = express();
const router = express.Router();
const {
  getFlightsToday,
  postFlights,
  getFlights,
  getFlight,
} = require("../controllers/flightControllers");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.route("/today").get(getFlightsToday);
router.route("/").get(getFlights);
router.route(`/this`).get(getFlight);

router.route("/").post(postFlights);

module.exports = router;
