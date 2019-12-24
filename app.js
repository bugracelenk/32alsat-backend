const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");

require("./models/profile");
require("./models/user");

const userRoute = require("./routes/users");
const profileRoute = require("./routes/profiles");

mongoose
  .connect(
    "mongodb://localhost/32alsat",
    { useNewUrlParser: true }
  )//bağlantı yapıyo
  .then(() => console.log("Connected to MongoDB"))//bağlandığını bildiriyo
  .catch(err => console.log(err));//hataları ekrana basıyo
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => { //CORS İzinleri
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/api/users", userRoute);
app.use("/api/profiles", profileRoute);

module.exports = app;