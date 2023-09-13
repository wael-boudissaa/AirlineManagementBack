const express = require("express");
const router = express.Router();
const {
  createGroupe,
  getGroupes,
  affectGroupe,
  getEmployesFromGroupe,
} = require("../controllers/groupeControllers");

// router.route("/").post(createGroupe);
router.route("/").post(createGroupe);

router.route("/").get(getGroupes);
router.route(`/this`).get(getEmployesFromGroupe);

router.route("/").patch(affectGroupe);

module.exports = router;
