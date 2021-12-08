const express = require("express");
const fs = require("fs");
const cors = require("cors");
const crypto = require("crypto");
const app = express();
const mongoose = require("mongoose");
const axios = require("axios");
const JWT = require("jsonwebtoken");
const serviceStorage = require("./storage/service_storage");
let apiGateway;
const cityMethods = require("./methods/city_methods");
const cityController = require("./controllers/CityController");
const City = require("./models/City");
const cities = require("./data/city.json");
const secret = "21SD1S11SD1S1S2"; // on obtiendra la clé par var env. (process.env.SECRET_KEY)
const updateDatabase = async () => {
  // delete all
  const citiesCount = await City.countDocuments();

  const cityAdded = [];
  if (citiesCount == 0)
    await cities.forEach(async (e) => {
      if (!cityAdded.includes(e.name)) {
        const numDep = e.department_code;

        const region = await cityMethods.getRegionByDepCode(numDep);

        let newCity = new City({
          name: e.name,
          regionName: region ?? "",
          randomSelected: false,
        });
        await newCity.save();
        cityAdded.push(e.name);
      }
    });
};
console.log("City Info updated");

app.use(
  cors({
    origin: apiGateway,
  })
);
app.use((req, res, next) => {
  if (req.headers.authorization === undefined) {
    return res.status(500).json({ message: "Authorization field empty !" });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (token) {
    try {
      const data = JWT.verify(token, secret);
      console.log(data);
      next();
    } catch (err) {
      console.log(err);
      return res
        .status(403)
        .json({ message: "Forbidden!", error: "access_notfound" });
    }
  }
});
app.use(cityController);

app.listen(3035, async () => {
  serviceStorage.saveFile(3035);
  apiGateway = serviceStorage.getApiGateway();
  try {
    await mongoose.connect(
      "mongodb+srv://ikt:XUrBFX4GT64tdyeP@cluster0.4jzpj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    );
    console.log("CityInfo service started and stored");
  } catch (err) {
    console.log("Error to connect database " + err);
  }
  await updateDatabase();
});
