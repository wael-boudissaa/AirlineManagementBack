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
const validator = require("validator");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "wael",
  database: "flightmanagement",
});
const ageToken = 60 * 60 * 1000;

const createAccesToken = (id, type,) => {
  return jwt.sign({ id: id, type: type }, "accesbaba", { expiresIn: "15min" });
};
function createRefreshToken(id, type, expiresIn = "1d") {
  const payload = {
    id: id,
    type: type,
  };

  // Sign the token with a different secret key and set an expiration time
  const token = jwt.sign(payload, "refreshbaba", {
    expiresIn: expiresIn,
  });

  return token;
}

const SignUp = async (req, res, next) => {
  try {
    if (!validator.isEmail(req.body.email)) {
      return res.status(400).send({ msg: "Invalid email address" });
    }

    const [existingUser] = await pool.execute(
      "SELECT * FROM profile WHERE LOWER(email) = LOWER(?)",
      [req.body.email]
    );

    if (existingUser.length) {
      return res.status(409).send({ msg: "This email is already in use" });
    }

    const idUser = uuidv4();
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const [result] = await pool.execute(
      "INSERT INTO profile (idprofile, first_name,last_name, adresse ,email, password) VALUES (?,?,?,?,?,?)",
      [
        idUser,
        req.body.first_name,
        req.body.last_name,
        req.body.adresse,
        req.body.email,
        hashedPassword,
      ]
    );
    if (result) {
      const token = createAccesToken(idUser);
      return res.status(201).send({ msg: "User created successfully", token });
    }
  } catch (error) {
    console.error("Error in sign-up:", error);
    return res.status(500).send({ msg: "Internal server error" });
  }
};

const LogIn = async (req, res, next) => {
  try {
    const [existingUser] = await pool.execute(
      `SELECT p.*, '' AS status 
      FROM profile p 
      LEFT JOIN employe e ON p.idprofile = e.idprofile 
      LEFT JOIN superuser s ON p.idprofile = s.idprofile 
      WHERE e.idprofile IS NULL AND s.idprofile IS NULL AND p.email = ? 
      UNION ALL 
      SELECT profile.*, 'admin' AS status 
      FROM superuser NATURAL JOIN profile 
      WHERE email = ? 
      UNION ALL 
      SELECT profile.*, 'employe' AS status 
      FROM employe NATURAL JOIN profile 
      WHERE email = ?`,
      [req.body.email, req.body.email, req.body.email]
    );

    if (!existingUser.length) {
      return res.status(401).send({ error: "Email or password is incorrect" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      existingUser[0]["password"]
    );

    if (isPasswordValid) {
      const accessToken = createAccesToken(
        existingUser[0].idprofile,
        existingUser[0].status
      );

      const refreshToken = createRefreshToken(existingUser[0].idprofile);
      await pool.execute(
        `UPDATE profile SET refreshToken = ? WHERE idprofile = ?`,
        [refreshToken, existingUser[0].idprofile]
      );
      await pool.execute(
        "UPDATE profile SET last_login = NOW() WHERE idprofile = ?",
        [existingUser[0].idprofile]
      );

      return res.status(200).send({
        data: {
          msg: "Logged in successfully",
          accessToken: accessToken,
          refreshToken: refreshToken,
          user: existingUser[0],
        },
      });
    } else {
      return res.status(401).send({ error: "Email or password is incorrect" });
    }
  } catch (error) {
    console.error("Error in log-in:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
};
const updateToken = async (req, res) => {
  const idprofile = req.body.idprofile;
  const refreshTokenquery = `select refreshToken from profile where idprofile = '${idprofile}'`;
  try {
    // Verify the refresh token
    let [refreshTokenresult] = await pool.execute(refreshTokenquery, [
      idprofile,
    ]);

    jwt.verify(
      refreshTokenresult[0].refreshToken,
      "refreshbaba",
      (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            console.log("Refresh token has expired");
            return res.status(403).json({ error: "Refresh token has expired" });
          } else {
            console.error("Refresh token verification error:", err.message);
            return res
              .status(403)
              .json({ error: "Refresh token verification error" });
          }
        }

        console.log("Refresh token is valid");

        // Generate a new access token (assuming you have a function for it)
        const newAccessToken = createAccesToken(decoded.id, decoded.type);

        // Send the new access token as the response
        return res.json({ newAccessToken });
      }
    );
  } catch (error) {
    console.error("Error in updateToken:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { SignUp, LogIn, updateToken };
