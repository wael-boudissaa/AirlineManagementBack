const express = require("express");
const asyncHandler = require("express-async-handler");
const app = express();
const mysql = require("mysql2/promise");
const { v4: uuidv4 } = require("uuid");
const uuid = uuidv4();
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "wael",
  database: "flightmanagement",
});

const getFlightInfos = async (req, res) => {
  const query = "SELECT * FROM flightinfo ";
  try {
    const [result] = await pool.execute(query);
    if (result) return res.status(200).send(result);
  } catch (err) {
    console.log({ err: err });
  }
};
const postFlightInfos = async ( req, res) => {
  const query =
    " INSERT INTO flightinfo(idflightinfo,description,duration,destination,flightfrom) VALUES(?,?,?,?,?) ";

  values = [
    uuidv4(),
    req.body.description,
    req.body.duration,
    req.body.destination,
    req.body.flightfrom,
  ];

  try {
    const result = await pool.execute(query, values);
    if (result) {
      res.status(200).send({ msg: "The information has been saved" });
    } else {
      console.log({ msg: "There is an error in your sumbition" });
    }
  } catch (err) {
    console.log({ err: err });
  }
};
const getPlanes = asyncHandler(async (req, res) => {
  query = "SELECT * FROM airplane";
  try {
    const [result] = await pool.execute(query);
    if (result) {
      return res.json({ msg: "success", result });
    } else {
      console.error("Error inserting flight: No rows affected");
      res.status(500).json({ error: "Internal server error" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error", error });
  }
});

module.exports = { getFlightInfos, postFlightInfos, getPlanes };
