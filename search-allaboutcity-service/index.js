const express = require("express");
const fs = require("fs");
const cors = require("cors");
const crypto = require("crypto");
const app = express();
const axios = require("axios");
const serviceStorage = require("./storage/service_storage");
const searchRoutes = require("./routes/SearchRoutes");
let apiGateway;

app.use(express.json());
app.use(cors());

/**
 * fait la recherche city en fonction des preferences utilisateur
 * doit récuperer : allaboutcity, location si location demandée, meteo, flight ticket, train, hotel
 */

app.use(searchRoutes);

app.listen(30001, async () => {
  serviceStorage.saveFile(30001);
  apiGateway = serviceStorage.getApiGateway();
  console.log("SearchAllAboutCity Service started and stored");
});
