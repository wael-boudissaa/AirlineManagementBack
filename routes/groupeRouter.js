const express = require("express");
const router = express.Router();
const {
  createGroupe,
  getGroupes,
  affectGroupe,
  getEmployeGroupe,
  getEmployesFromGroupeHasnoFlight,
} = require("../controllers/groupeControllers");

// router.route("/").post(createGroupe);
router.route("/").post(createGroupe);

router.route("/").get(getGroupes);
router.route("/this").get(getEmployeGroupe);

router.route(`/hasnoflights`).get(getEmployesFromGroupeHasnoFlight);

router.route("/").patch(affectGroupe);

module.exports = router;
