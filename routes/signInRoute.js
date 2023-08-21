const express = require("express");
const app = express();
const router = express.Router();
const { SignUp, LogIn } = require("../controllers/signinController");
const {
  signupValidation,
  loginValidation,
} = require("../controllers/validation");
router.route("/up").post(signupValidation, SignUp);
router.route("/in").post(loginValidation, LogIn);

module.exports = router;
