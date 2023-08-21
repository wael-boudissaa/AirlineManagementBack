const express = require("express");
const errHandler = require("./middleware/errHandler");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
app.use(bodyParser.json());

app.use("/flights", require("./routes/flightRoutes"));
app.use(express.json());
app.use("/sign", require("./routes/signInRoute"));
app.use(errHandler);

app.listen(process.env.PORT, () => {
  console.log(`the project is running on port ${process.env.PORT}`);
});
