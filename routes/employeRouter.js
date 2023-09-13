const express = require("express");
const router = express.Router();
const { getemployeToday ,getEmploye} = require("../controllers/employeControllers");

router.route("/today").get(getemployeToday);
router.route("/").get(getEmploye);

module.exports = router;
