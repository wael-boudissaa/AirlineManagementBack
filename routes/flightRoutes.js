const express = require("express");
const app = express();
const router = express.Router();
const {
  getFlightsToday,
  postFlights,
  getFlights,
  getFlight,
  getFlightForOneEmploye,
  getAllFlights,
  getYearFlights,
} = require("../controllers/flightControllers");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.route("/today").get(getFlightsToday);
router.route("/all").get(getAllFlights);
router.route("/year").get(getYearFlights);
router.route("/").get(getFlights);
router.route(`/this`).get(getFlight);
router.route(`/q`).get(getFlightForOneEmploye);

router.route("/").post(postFlights);

module.exports = router;
