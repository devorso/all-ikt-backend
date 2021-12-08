const express = require("express");
const fs = require("fs");
const cors = require("cors");
const crypto = require("crypto");
const app = express();
const axios = require("axios");
const JWT = require("jsonwebtoken");
const publicIp = require("public-ip");
const secret = "21SD1S11SD1S1S2"; // on obtiendra la clé par var env. (process.env.SECRET_KEY)
var getIP = require("ipware")().get_ip;
const serviceStorage = require("./storage/service_storage");
let apiGateway;
const listCityFile = require("./data/city.json");

const getLocation = async (ip) => {
  const response = await axios.default.get("http://ip-api.com/json/" + ip);
  if (response.data["status"] === "success") {
    return response.data["city"];
  }
  return "null";
};
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
      return res
        .status(403)
        .json({ message: "Forbidden!", error: "access_notfound" });
    }
  }
});
app.get("/location/:ip", async (req, res, next) => {
  const ip = req.params.ip;
  return res.status(200).json({ city: await getLocation(ip) });
});
app.get("/location", async (req, res, next) => {
  const ip = await publicIp.v4();
  console.log(ip);
  return res.status(200).json({ city: await getLocation(ip) });
});
app.listen(3058, async () => {
  serviceStorage.saveFile(3058);
  apiGateway = serviceStorage.getApiGateway();
  console.log("LocationService  started and stored");
});
