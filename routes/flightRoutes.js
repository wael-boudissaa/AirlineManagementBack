const express = require("express");
const app = express();
const router = express.Router();
const { getFlights } = require("../controllers/flightControllers");

router.route("/").get(getFlights);

module.exports = router;
