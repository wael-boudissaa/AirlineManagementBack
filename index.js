const express = require("express");
const errHandler = require("./middleware/errHandler");
const app = express();
app.use(express.json());

const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
// const path = require("path");
const logRequests = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Call next to continue processing the request
};

// Apply the middleware to every request
app.use(logRequests);
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend's origin
    methods: "GET,POST,PATCH", // Specify the allowed HTTP methods
    credentials: true, // Allow cookies and other credentials to be sent
  })
);
// app.use(bodyParser.json());

app.use("/flight", require("./routes/flightRoutes"));
app.use("/flightinfo", require("./routes/flightInfoRoutes"));
app.use("/employe", require("./routes/employeRouter"));
app.use("/sign", require("./routes/signInRoute"));
app.use("/groupe", require("./routes/groupeRouter"));

app.use(errHandler);

app.listen(process.env.PORT, () => {
  console.log(`the project is running on port ${process.env.PORT}`);
});
