const express = require("express");
const router = express.Router();
const {
  getemployeToday,
  getEmployeHasnoFlight,
  getEmployeFlight,
  postEmployeFlight,
  addProfileEmploye,
  addProfileAdmin,
  getEmploye,
  getOneEmploye,
  getOneAdmin,
} = require("../controllers/employeControllers");

router.route("/today").get(getemployeToday);
router.route("/hasnoflight").get(getEmployeHasnoFlight);
router.route("/").get(getEmploye);
router.route("/one").get(getOneEmploye);
router.route("/adm").get(getOneAdmin);

router.route("/this").get(getEmployeFlight);
router.route("/").post(postEmployeFlight);
router.route("/").patch(addProfileEmploye);
router.route("/profileadmin").patch(addProfileAdmin);

module.exports = router;
