const express = require("express");
const router = express.Router();
const {
  getProfile,
  getOneProfile,
} = require("../controllers/profileController");

router.route("/").get(getProfile);
router.route("/one").post(getOneProfile);

module.exports = router;
