const express = require("express");
const fs = require("fs");
const cors = require("cors");
const crypto = require("crypto");
const app = express();
const axios = require("axios");
const serviceStorage = require("./storage/service_storage");
let apiGateway;
const getMeteoInfo = async (city) => {
  const response = await axios.default.get(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=bf15de267ae8c3621d091aac867c5e27"
  );
  console.log(response.data);
  if (response.status === 404) {
    return "";
  }
  return response.data;
};

app.use(
  cors({
    origin: apiGateway,
  })
);

app.get("/:cityName", async (req, res, next) => {
  return res
    .status(200)
    .json({ meteo: await getMeteoInfo(req.params.cityName) });
});

app.listen(3037, async () => {
  serviceStorage.saveFile(3037);
  apiGateway = serviceStorage.getApiGateway();
  console.log("MeteoService started and stored");
});
