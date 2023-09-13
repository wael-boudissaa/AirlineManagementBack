const express = require("express");
const asyncHandler = require("express-async-handler");
const app = express();
// const mysql = require("mysql2");
const mysql = require("mysql2/promise");

const { signupValidation, loginValidation } = require("./validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const uuid = uuidv4();

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "wael",
  database: "flightmanagement",
});

const SignUp = async (req, res, next) => {
  try {
    const [existingUser] = await pool.execute(
      "SELECT * FROM profile WHERE LOWER(email) = LOWER(?)",
      [req.body.email]
    );

    if (existingUser.length) {
      return res.status(409).send({
        msg: "This user is already in use!",
      });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const [result] = await pool.execute(
        "INSERT INTO profile (idprofile, first_name, email, password) VALUES (?, ?, ?, ?)",
        [uuid, req.body.first_name, req.body.email, hashedPassword]
      );

      return res.status(201).send({
        msg: "The user has been registered with us!",
      });
    }
  } catch (error) {
    return res.status(500).send({
      msg: error.message,
    });
  }
};

const LogIn = async (req, res, next) => {
  const [existingUser] = await pool.execute(
    `SELECT * FROM profile WHERE email = ${pool.escape(req.body.email)}`
  );

  if (!existingUser.length) {
    return res.status(401).send({
      msg: "Email or password is incorrect!",
    });
  }
  // check password
  bcrypt.compare(
    req.body.password,
    existingUser[0]["password"],
    (bErr, bResult) => {
      // wrong password
      if (bErr) {
        return res.status(401).send({
          msg: "Email or password is incorrect!",
        });
      }
      if (bResult) {
        const token = jwt.sign(
          { id: existingUser[0].id },
          "the-super-strong-secrect",
          { expiresIn: "1h" }
        );
        const upadateProfile = pool.execute(
          `UPDATE profile SET last_login = now() WHERE idprofile ='${existingUser[0].idprofile}'`
        );
        return res.status(200).send({
          msg: "Logged in!",
          token,
          user: existingUser[0],
        });
      }
      return res.status(401).send({
        msg: "Username or password is incorrect!",
      });
    }
  );
};

module.exports = { SignUp, LogIn };
