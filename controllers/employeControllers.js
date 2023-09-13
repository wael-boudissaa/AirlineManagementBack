const express = require("express");
const asyncHandler = require("express-async-handler");
const app = express();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "wael",
  database: "flightmanagement",
});
const getemployeToday = async (req, res) => {
  const idflight = req.query.idflight;
  const query = `SELECT first_name ,last_name , adresse , email ,idemploye 
  FROM
  flight NATURAL JOIN employehasflight NATURAL JOIN employe NATURAL JOIN profile 
  WHERE (flight.idflight) = '${idflight}'; 
  `;
  try {
    const [result] = await pool.execute(query);
    if (result) return res.send(result);
    else return console.log({ msg: err });
  } catch (err) {
    console.log({ msg: err });
  }
};

const getEmploye = async (req, res) => {
  const query = `SELECT *
  FROM
   employe NATURAL JOIN profile 
  `;
  try {
    const [result] = await pool.execute(query);
    if (result) return res.send(result);
    else return console.log({ msg: err });
  } catch (err) {
    console.log({ msg: err });
  }
};
module.exports = { getemployeToday, getEmploye };
