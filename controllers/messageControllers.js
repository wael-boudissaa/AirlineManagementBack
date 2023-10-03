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

const getAdmins = async (req, res) => {
  const queryAdmin = `select * from superuser natural join profile `;

  try {
    const [result] = await pool.execute(queryAdmin);
    if (result) {
      res.status(200).send(result);
    } else {
      res.send({ msg: "There is no Admins" });
    }
  } catch (err) {
    res.send({ msg: err });
  }
};

const postTicket = async (req, res) => {
  const message = req.body.message;
  const queryCreateTicket = `insert into ticket(idticket,title,idemploye,adminid) values (?,?,?,?)`;
  const queryInsertMessage = `insert into message(idmessage,text,source,idticket,messagetime) values (?,?,?,?,NOW())`;

  try {
    const idTicket = uuidv4();
    values = [idTicket, req.body.title, req.body.idemploye, req.body.adminid];

    const [result] = await pool.execute(queryCreateTicket, values);
    if (result) {
      if (message) {
        values = [uuidv4(), message, req.body.idprofile, idTicket];

        const [resultMessage] = await pool.execute(queryInsertMessage, values);
        if (resultMessage) {
          res.status(200).send({ msg: "Message Sent" });
        } else {
          res.status(400).send({ msg: "Err Sent" });
        }
      } else {
        res.status(200).send({ msg: "Ticket Created now u can message" });
      }
    } else {
      res.send({ msg: "Failed" });
    }
  } catch (err) {
    res.send({ msg: err });
  }
};

const getTicketEmploye = async (req, res) => {
  const idemploye = req.query.idemploye;

  const query = `SELECT * FROM ticket  where idemploye ="${idemploye}"`;
  try {
    const [result] = await pool.execute(query);
    if (result) {
      res.status(200).send(result);
    } else {
      res.send({ msg: "There is no employe" });
    }
  } catch (err) {
    res.send({ msg: err });
  }
};
const getTicketAdmin = async (req, res) => {
  const adminid = req.query.adminid;

  const query = `SELECT * FROM ticket where adminid ="${adminid}"`;
  try {
    const [result] = await pool.execute(query);
    if (result) {
      res.status(200).send(result);
    } else {
      res.send({ msg: "There is no Admin" });
    }
  } catch (err) {
    res.send({ msg: err });
  }
};
const getMessages = async (req, res) => {
  const idticket = req.query.idticket;

  const query = `SELECT * FROM message where idticket ="${idticket}" order by messagetime`;
  try {
    const [result] = await pool.execute(query);
    if (result) {
      res.status(200).send(result);
    } else {
      res.send({ msg: "There is no Messages" });
    }
  } catch (err) {
    res.send({ msg: err });
  }
};

//?? we should add time 
const postMessage = async (req, res) => {
  const message = req.body.message;
  const queryInsertMessage = `insert into message(idmessage,text,source,idticket,messagetime) values (?,?,?,?,NOW())`;

  try {
    values = [uuidv4(), message, req.body.idprofile, req.body.idticket];

    const [resultMessage] = await pool.execute(queryInsertMessage, values);
    if (resultMessage) {
      res.status(200).send({ msg: "Message Sent" });
    } else {
      res.status(400).send({ msg: "Err Sent" });
    }
  } catch (err) {
    res.send({ msg: err });
  }
};

module.exports = {
  getAdmins,
  postTicket,
  getTicketEmploye,
  getTicketAdmin,
  getMessages,
  postMessage,
};
