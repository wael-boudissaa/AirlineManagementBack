const express = require("express");
const asyncHandler = require("express-async-handler");
const app = express();
const mysql = require("mysql2/promise");
const { v4: uuidv4 } = require("uuid");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "wael",
  database: "flightmanagement",
});

const getProfile = async (req, res) => {
  const queryEmploye = `SELECT *, 'employe' AS status FROM employe NATURAL JOIN profile`;
  const queryAdmin = `SELECT *, 'admin' AS status FROM superuser NATURAL JOIN profile`;
  const queryProfile = `
    SELECT p.*, '' AS status 
    FROM profile p 
    LEFT JOIN employe e ON p.idprofile = e.idprofile 
    LEFT JOIN superuser s ON p.idprofile = s.idprofile 
    WHERE e.idprofile IS NULL AND s.idprofile IS NULL
  `;

  try {
    const [resultEmploye] = await pool.execute(queryEmploye);
    const [resultAdmin] = await pool.execute(queryAdmin);
    const [resultProfile] = await pool.execute(queryProfile);

    const modifiedEmploye = resultEmploye.map((e) => ({
      ...e,
      status: "employe",
    }));
    const modifiedAdmin = resultAdmin.map((e) => ({ ...e, status: "admin" }));
    const modifiedProfile = resultProfile.map((p) => ({
      ...p,
      status: "",
    }));

    const result = [...resultAdmin, ...resultEmploye, ...resultProfile];

    if (result) {
      return res.status(200).send(result);
    } else {
      console.log("No results found.");
      return res.status(404).send("No results found.");
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Internal server error");
  }
};

const getOneProfile = async (req, res) => {
  const idprofile = req.body.idprofile;
  const query = `SELECT * FROM PROFILE WHERE idprofile = '${idprofile}'`;

  try {
    const [result] = await pool.execute(query);
    if (result) {
      res.send(result);
    } else {
      res.send("There is no profile ");
    }
  } catch (err) {
    res.send(err);
  }
};

module.exports = { getProfile, getOneProfile };
