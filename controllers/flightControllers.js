const express = require("express");
const asyncHandler = require("express-async-handler");
const app = express();
const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost", // Change this to your database host
  user: "root",
  password: "wael",
  database: "flightmanagement",
});
const getFlights = asyncHandler(async (req, res) => {
  query = "SELECT * from  flight";
  connection.query(query, (err, result) => {
    if (err) return err;
    res.send(result);
  });
});
module.exports = { getFlights };
