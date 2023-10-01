const express = require("express");
const app = express();
const router = express.Router();
const {
  SignUp,
  LogIn,
  updateToken,
} = require("../controllers/signinController");
const {
  signupValidation,
  loginValidation,
} = require("../controllers/validation");
router.route("/up").post(SignUp);
router.route("/in").post(loginValidation, LogIn);
router.route("/update").post(updateToken);

module.exports = router;
