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
  const query = `select * from employe NATURAL JOIN profile `;
  try {
    const [result] = await pool.execute(query);
    if (result) return res.send(result);
    else return console.log({ msg: err });
  } catch (err) {
    console.log({ msg: err });
  }
};

const getEmployeFlight = asyncHandler(async (req, res) => {
  const idflight = req.query.idflight;
  query = `
    SELECT * FROM
     employehasflight NATURAL JOIN employe natural join profile 
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

const getEmployeHasnoFlight = async (req, res) => {
  const query = `SELECT employe.*,profile.*,employe.* fROM employe natural join profile left join employehasflight as e on employe.idemploye = e.idemploye   
where e.idflight is null 
union   
select employe.*,profile.*,employe.*  from employe natural join profile natural join employehasflight natural join flight  where flight.dateflight < curdate()
and profile.idprofile not in (
select profile.idprofile from employe natural join profile natural join employehasflight natural join flight  where flight.dateflight > curdate())
  `;
  try {
    const [result] = await pool.execute(query);
    if (result) return res.send(result);
    else return console.log({ msg: err });
  } catch (err) {
    console.log({ msg: err });
  }
};

const postEmployeFlight = async (req, res) => {
  const queryPost = `INSERT into employehasflight (idflight,idemploye) VALUES (?,?); `;
  const values = [req.body.idflight, req.body.idemploye];

  try {
    const result = await pool.execute(queryPost, values);
    if (result) return res.status(200).send("employe affected");
    else return console.log({ msg: "err" });
  } catch (err) {
    console.log(err);
  }
};
const addProfileEmploye = async (req, res) => {
  const queryPatchEmploye = `INSERT INTO EMPLOYE (idemploye,idprofile) VALUES (?,?); `;

  try {
    const idEmploye = uuidv4();
    const [result] = await pool.execute(queryPatchEmploye, [
      idEmploye,
      req.body.idprofile,
    ]);
    if (result) {
      return res.status(200).send({ msg: "this profile became Employe " });
    } else {
      return console.log({ msg: "err" });
    }
  } catch (err) {
    console.log(err);
  }
};
const addProfileAdmin = async (req, res) => {
  const queryPatchEmploye = `INSERT INTO superuser (adminid,idprofile) VALUES (?,?); `;

  try {
    const idAdmin = uuidv4();
    const [result] = await pool.execute(queryPatchEmploye, [
      idAdmin,
      req.body.idprofile,
    ]);
    if (result) {
      return res.status(200).send({ msg: "this profile became admin " });
    } else {
      return console.log({ msg: "err" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getemployeToday,
  getEmployeHasnoFlight,
  getEmployeFlight,
  postEmployeFlight,
  addProfileEmploye,
  addProfileAdmin,
  getEmploye,
};
