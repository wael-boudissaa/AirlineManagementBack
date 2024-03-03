const express = require("express");
const asyncHandler = require("express-async-handler");
const app = express();
const mysql = require("mysql2/promise");
const { v4: uuidv4 } = require("uuid");
const uuid = uuidv4();

const pool = mysql.createPool({
  host: "sql11.freemysqlhosting.net",
  user: "sql11688344",
  password: "fkjJj5KBKt",
  database: "sql11688344",
});
const groupe = [];

const createGroupe = async (req, res) => {
  tableName = req.body.table_name;
  const query = `CREATE TABLE if not exists ${tableName} (idgroupe varchar(40) PRIMARY KEY  ); `;
  const addgroupetoList = `INSERT INTO groupes (idgroupe , name_groupe ) VALUES  (?,'${tableName}')`;

  const insertQuery = `INSERT INTO ${tableName} (idgroupe) VALUES (?) `;
  const checkTableGroupeQuery = `select * from ${tableName}`;
  // `;
  // const querycheckTableEmploye = `select * from employein${tableName}`;
  const querycheckTableGroupe = `select * from ${tableName}`;

  // const groupeInsert = `
  // INSERT INTO employein${tableName} (idgroupe, tablename)
  // VALUES (?, '${tableName}');
  // `;
  try {
    const tableid = uuidv4();
    const result = await pool.execute(query);
    if (result) {
      const [checkTableGroupe] = await pool.execute(checkTableGroupeQuery);
      if (checkTableGroupe.length === 0) {
        const resultInsert = await pool.execute(insertQuery, [tableid]);
        if (resultInsert) {
          const resultaddgroupelist = await pool.execute(addgroupetoList, [
            tableid,
          ]);
          if (resultaddgroupelist) {
            return res.send({ msg: "Table  Created" });
          } else {
            res.send({ msg: "err" });
          }

          // const createEmployeTable = await pool.execute(createEmployeGroupe);
          // if (createEmployeGroupe) {
          //   const [check] = await pool.execute(querycheckTableEmploye);
          //   console.log(check.length);
          //   if (check.length === 0) {
          // const resultinsert = await pool.execute(groupeInsert, [tableid]);
        }
      } else return res.send({ err: "Table Already Created" });
    } else {
      console.log("err");
    }
  } catch (err) {
    console.log(err);
  }
};

const getGroupes = async (req, res) => {
  const query = `select * from groupes`;

  try {
    const [result] = await pool.execute(query);
    if (result) res.send(result);
  } catch (err) {
    res.send({ msg: err });
  }
};

const getEmployesFromGroupeHasnoFlight = async (req, res) => {
  const groupename = req.query.name_groupe;
  const query = `select profile.*,employe.*  from employein${groupename} natural join employe natural join profile left join employehasflight as e on employe.idemploye = e.idemploye   
  where e.idflight is null 
  union 
  select profile.*,employe.*  from employe natural join employein${groupename} natural join profile natural join employehasflight natural join flight  where flight.dateflight <= curdate()
  and profile.idprofile not in (
  select profile.idprofile from employe natural join profile natural join employehasflight natural join flight  where flight.dateflight > curdate())
  `;
  try {
    const [result] = await pool.execute(query);
    if (result) res.send(result);
  } catch (err) {
    res.send({ msg: err });
  }
};
const getEmployeGroupe = async (req, res) => {
  const groupename = req.query.name_groupe;
  const query = `select * from employein${groupename} natural join employe natural join profile 
  `;
  try {
    const [result] = await pool.execute(query);
    if (result) res.send(result);
  } catch (err) {
    res.send({ msg: err });
  }
};

const affectGroupe = async (req, res) => {
  const tablename = req.body.table_name;
  const idgroupe = req.body.idgroupe;
  const idemploye = req.body.idemploye;
  const createEmployeGroupe = `
  CREATE TABLE IF NOT EXISTS employein${tablename} (
  idgroupe varchar(40),
  idemploye varchar(40),
  tablename varchar(40),
  CONSTRAINT fk_idgroupe${tablename} foreign key (idgroupe) references ${tablename} (idgroupe),
  CONSTRAINT fk_idemploye${tablename} foreign key (idemploye) references employe (idemploye),
  PRIMARY KEY (idemploye,idgroupe)
);

`;
  // const timestamp = Date.now();

  // const updateTableQuery = `
  //   ALTER TABLE employein${tablename}
  //   DROP FOREIGN KEY fk_idgroupe${tablename},
  //   ADD COLUMN idemploye varchar(40),
  //   ADD CONSTRAINT fk_idemploye${timestamp} FOREIGN KEY (idemploye) REFERENCES employe (idemploye),
  //   ADD CONSTRAINT fk_idgroupe${timestamp} FOREIGN KEY (idgroupe) REFERENCES ${tablename} (idgroupe),
  //   ADD PRIMARY KEY (idemploye, idgroupe)
  // `;

  const affectEmployeGroupe = `
INSERT INTO employein${tablename} (idgroupe, idemploye,tablename)
VALUES ('${idgroupe}', '${idemploye}','${tablename}');

`;

  try {
    // const [rows] = await pool.execute(
    //   `SELECT COLUMN_NAME
    //        FROM INFORMATION_SCHEMA.COLUMNS
    //       WHERE TABLE_NAME = 'employein${tablename}' AND COLUMN_NAME = 'idemploye';`
    // );
    // console.log(rows.length);
    // if (rows.length === 0) {
    await pool.execute(createEmployeGroupe);

    // Create the employehasgroupe table if it doesn't exist

    // Insert data into the table
    const resultInsert = await pool.execute(affectEmployeGroupe);

    if (resultInsert) {
      res.send({ msg: "The employe has been affected " });
    } else {
      console.log("Error inserting data ");
    }
  } catch (err) {
    console.log(err);
  }
};

// const affectGroupe = async (req, res) => {
//   const tablename = req.body.table_name;
//   const idgroupe = req.body.idgroupe;
//   const idemploye = req.body.idemploye;
//   const createEmployeGroupe = `CREATE TABLE  IF NOT EXISTS  employehasgroupe (
//     idgroupe varchar(40) ,
//     idemploye varchar(40),
//      foreign key (idgroupe) references sonatrach (idgroupe),
//       foreign key (idemploye) references employe (idemploye),
//       primary key (idemploye,idgroupe)
//        );`;
//   const affectEmployeGroupe = `INSERT INTO employehasgroupe (idgroupe, idemploye)
//   VALUES (${idgroupe}, ${idemploye});
//   `;
//   try {
//     const result = await pool.execute(createEmployeGroupe);
//     if (result) {
//       const resultInsert = await pool.execute(affectEmployeGroupe);
//       if (resultInsert) res.send({ msg: "Table Created " });
//     } else {
//       console.log("err");
//     }
//   } catch (err) {
//     console.log(err);
//   }

// };
//   const createEmployeGroupe = `CREATE TABLE IF NOT EXISTS employehasgroupe (
//     idgroupe varchar(40),
//     idemploye varchar(40),
//     foreign key (idgroupe) references ? (idgroupe),
//     foreign key (idemploye) references employe (idemploye),
//     primary key (idemploye,idgroupe)
// )`;

// const affectEmployeGroupe = `INSERT INTO employehasgroupe (idgroupe, idemploye) VALUES (?, ?)`;

// try {
//   // Create the employehasgroupe table if it doesn't exist
//   await pool.execute(createEmployeGroupe, [tablename]);
//   res.send("succed");
//   // Insert data into the table
//   const resultInsert = await pool.execute(affectEmployeGroupe, [
//     idgroupe,
//     idemploye,
//   ]);

//   if (resultInsert) {
//     res.send({ msg: "Row inserted into employehasgroupe" });
//   } else {
//     console.log("Error inserting data into employehasgroupe");
//   }
// } catch (err) {
//   console.log(err);
// }

module.exports = {
  createGroupe,
  getGroupes,
  affectGroupe,
  getEmployesFromGroupeHasnoFlight,
  getEmployeGroupe,
};
