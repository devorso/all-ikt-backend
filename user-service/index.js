const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/User");
const JWT = require("jsonwebtoken");
const userController = require("./routes/UserRoutes");
const userFavouritesController = require("./routes/UserFavouritesRoutes");
const userPreferencesRoutes = require("./routes/UserPreferencesRoutes");
const app = express();
const serviceStorage = require("./storage/service_storage");
const secret = "21SD1S11SD1S1S2"; // on obtiendra la clé par var env. (process.env.SECRET_KEY)

let apiGateway;
app.use(
  cors({
    // origin: apiGateway,
    allowedHeaders: "Content-Type",
  })
);
// support parsing of application/json type post data
app.use(express.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  if (!req.path.includes("createUser")) {
    console.log("auth " + req.headers.authorization);
    if (req.headers.authorization === undefined) {
      return res.status(500).json({ message: "Authorization field empty !" });
    }
    const token = req.headers.authorization.split(" ")[1];
    if (token !== undefined) {
      try {
        const data = JWT.verify(token, secret);
        console.log("decode " + JSON.stringify(data));
        next();
      } catch (err) {
        return res
          .status(403)
          .json({ message: "Forbidden!", error: "access_notfound", err });
      }
    }
  } else {
    next();
  }
});

app.use(userFavouritesController);
app.use(userPreferencesRoutes);
app.use(userController);
app.listen(3031, async () => {
  serviceStorage.saveFile(3031);
  apiGateway = serviceStorage.getApiGateway();
  try {
    await mongoose.connect(
      "mongodb+srv://ikt:XUrBFX4GT64tdyeP@cluster0.4jzpj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    );
    console.log("User service started and stored");
  } catch (err) {
    console.log("Error to connect database " + err);
  }
});
