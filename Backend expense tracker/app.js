const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./models/expense");
const expenseRoutes = require("./routes/expense");

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: false }));

app.use(expenseRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(4000);
  })
  .catch((err) => console.log(err));
