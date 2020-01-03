const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");

require("./models/profile");
require("./models/user");
require("./models/yetki");
require("./models/tag");
require("./models/ilan");
require("./models/category");

const userRoute = require("./routes/users");
const profileRoute = require("./routes/profiles");
const storeRoute = require("./routes/stores");
const ilanRoute = require("./routes/ilanlar");

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
app.use("/api/stores", storeRoute);
app.use("/api/ilanlar", ilanRoute);

module.exports = app;