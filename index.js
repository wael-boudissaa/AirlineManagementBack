const express = require("express");
const errHandler = require("./middleware/errHandler");
const app = express();
const dotenv = require("dotenv").config();

app.use("/flights", require("./routes/flightRoutes"));
app.use(errHandler);
app.use(express.json());
app.listen(process.env.PORT, () => {
  console.log(`the project is running on port ${process.env.PORT}`);
});
