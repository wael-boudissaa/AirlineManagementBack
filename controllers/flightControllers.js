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

const getFlights = asyncHandler(async (req, res) => {
  query = `
  SELECT *
  FROM flight
  NATURAL JOIN flightinfo
  WHERE dateflight BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY);
  `;

  try {
    const [result] = await pool.execute(query);
    if (result) {
      return res.status(200).json({ msg: "success", result });
    } else {
      console.error("Error inserting flight: No rows affected");
      res.status(500).json({ error: "Internal server error" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error", err });
  }
});

const getFlight = asyncHandler(async (req, res) => {
  const idflight = req.query.idflight;
  query = `
    SELECT * FROM
     flight NATURAL JOIN flightinfo  natural join airplane natural join airplanepilot
      WHERE  idflight = ?
     
      `;

  try {
    const [result] = await pool.execute(query, [idflight]);
    if (result) {
      return res.status(200).json({ msg: "success", result });
    } else {
      console.error("Error inserting flight: No rows affected");
      res.status(500).json({ error: "Internal server error" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error", err });
  }
});

const getFlightsToday = asyncHandler(async (req, res) => {
  const authorization = req.headers.authorization;
  query = `
    SELECT idflight FROM
      (flight)
  WHERE DATE(flight.dateflight) = CURDATE() `;

  try {
    if (authorization) {
      const [result] = await pool.execute(query);
      if (result) {
        return res.json({ msg: "success", result });
      } else {
        console.error("Error inserting flight: No rows affected");
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      res.status(403);
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error", error });
  }
});

const postFlights = asyncHandler(async (req, res) => {
  const uuid = uuidv4();

  const query =
    "INSERT INTO flight(idflight, dateflight, idairplane,idflightinfo) VALUES (?, ?, ?, ?)";
  // Initialize with a starting code
  const idflight = uuid;
  const values = [
    idflight,
    req.body.dateflight,
    req.body.idairplane,
    req.body.idflightinfo,
  ];

  try {
    const [result] = await pool.execute(query, values);
    if (result && result.affectedRows > 0) {
      return res.json({ msg: "success", result });
    } else {
      console.error("Error inserting flight: No rows affected");
      res.status(500).json({ error: "Internal server error" });
    }
  } catch (error) {
    console.error("Error inserting flight:", error);
    res.status(500).json({ error: "Internal server error", error });
  }
});

const getFlightForOneEmploye = async (req, res) => {
  const idprofile = req.query.idprofile;
  const query = `SELECT * FROM flight natural join employehasflight natural join employe natural join profile natural join flightinfo where 
  idprofile ='${idprofile}' and dateflight>CURDATE()
  `;
  try {
    console.log(idprofile);
    const [result] = await pool.execute(query);
    console.log(result);

    if (result) {
      return res.status(200).send(result);
    } else {
      return res.send({ msg: "There is no Flight yet" });
    }
  } catch (err) {
    return res.send(err);
  }
};

//  (err, result) => {
//     if (err) {
//       console.error("Error inserting flight:", err);
//       res.status(500).json({ error: "Internal server error" });
//     } else {
//       res.json({ msg: "success", result });
//     }
//   }
module.exports = {
  getFlightsToday,
  postFlights,
  getFlights,
  getFlight,
  getFlightForOneEmploye,
};
