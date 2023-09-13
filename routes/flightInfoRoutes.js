const express = require("express");
const router = express.Router();
const {
  getFlightInfos,
  postFlightInfos,
  getPlanes,
} = require("../controllers/flightInfoControllers");

router.route("/").get(getFlightInfos);
router.route("/").post(postFlightInfos);
router.route("/plane").get(getPlanes);

module.exports = router;
