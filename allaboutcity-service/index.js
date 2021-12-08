const express = require("express");
const fs = require("fs");
const cors = require("cors");
const crypto = require("crypto");
const app = express();
const axios = require("axios");
//const regionsInfo = JSON.parse(require('./data/regions.json'))
const serviceStorage = require("./storage/service_storage");
const { response } = require("express");
let apiGateway;
/*
const getRegionByCityName = (cityName) => {
    let region;
    regionsInfo.forEach((reg) => {
        if (reg.city === cityName) {
            region = reg.admin_name;
        }
    })
    return region;
}*/
//const pathCommerces = "https://data.opendatasoft.com/api/records/1.0/search/?dataset=osm-shop-fr%40babel&q=&lang=fr&facet=type&facet=brand&facet=wheelchair&facet=departement&facet=commune&refine.commune=" + req.params.cityName
app.use(
  cors({
    origin: apiGateway,
  })
);

app.get("/supermarche/:cityName", async (req, res, next) => {
  const response = await axios.default.get(
    "https://data.opendatasoft.com/api/records/1.0/search/?dataset=osm-shop-fr%40babel&q=&lang=fr&facet=type&facet=brand&facet=wheelchair&facet=commune&refine.commune=" +
      req.params.cityName +
      "&refine.type=supermarket"
  );
  return res
    .status(200)
    .json({
      supermarche: response.data["records"],
      length: response.data["nhits"],
    });
});

app.get("/restaurant/:cityName", async (req, res, next) => {
  const response = await axios.default.get(
    "https://data.opendatasoft.com/api/records/1.0/search/?dataset=osm-shop-fr%40babel&q=&lang=fr&facet=type&facet=brand&facet=wheelchair&facet=commune&refine.commune=" +
      req.params.cityName +
      "&refine.type=restaurant"
  );
  return res
    .status(200)
    .json({
      restaurant: response.data["records"],
      length: response.data["nhits"],
    });
});

app.get("/banques/:cityName", async (req, res, next) => {
  const response = await axios.default.get(
    "https://data.opendatasoft.com/api/records/1.0/search/?dataset=osm-shop-fr%40babel&q=&lang=fr&facet=type&facet=brand&facet=wheelchair&facet=commune&refine.commune=" +
      req.params.cityName +
      "&refine.type=bank"
  );
  return res
    .status(200)
    .json({
      banques: response.data["records"],
      length: response.data["nhits"],
    });
});

app.get("/postes/:cityName", async (req, res, next) => {
  const response = await axios.default.get(
    "https://data.opendatasoft.com/api/records/1.0/search/?dataset=osm-shop-fr%40babel&q=&lang=fr&facet=type&facet=brand&facet=wheelchair&facet=commune&refine.commune=" +
      req.params.cityName +
      "&refine.type=post_office"
  );
  return res
    .status(200)
    .json({ postes: response.data["records"], length: response.data["nhits"] });
});

app.get("/pharmacie/:cityName", async (req, res, next) => {
  const response = await axios.default.get(
    "https://data.opendatasoft.com/api/records/1.0/search/?dataset=osm-shop-fr%40babel&q=&lang=fr&facet=type&facet=brand&facet=wheelchair&facet=commune&refine.commune=" +
      req.params.cityName +
      "&refine.type=pharmacy"
  );
  return res
    .status(200)
    .json({
      pharmacie: response.data["records"],
      length: response.data["nhits"],
    });
});
// add routes for commerce type (laposte, supermarket, etc)

app.get("/:cityName", async (req, res, next) => {
  const pharmacie = await axios.default.get(
    "https://data.opendatasoft.com/api/records/1.0/search/?dataset=osm-shop-fr%40babel&q=&lang=fr&facet=type&facet=brand&facet=wheelchair&facet=commune&refine.commune=" +
      req.params.cityName +
      "&refine.type=pharmacy"
  );

  const postes = await axios.default.get(
    "https://data.opendatasoft.com/api/records/1.0/search/?dataset=osm-shop-fr%40babel&q=&lang=fr&facet=type&facet=brand&facet=wheelchair&facet=commune&refine.commune=" +
      req.params.cityName +
      "&refine.type=post_office"
  );
  const banques = await axios.default.get(
    "https://data.opendatasoft.com/api/records/1.0/search/?dataset=osm-shop-fr%40babel&q=&lang=fr&facet=type&facet=brand&facet=wheelchair&facet=commune&refine.commune=" +
      req.params.cityName +
      "&refine.type=bank"
  );
  const restaurants = await axios.default.get(
    "https://data.opendatasoft.com/api/records/1.0/search/?dataset=osm-shop-fr%40babel&q=&lang=fr&facet=type&facet=brand&facet=wheelchair&facet=commune&refine.commune=" +
      req.params.cityName +
      "&refine.type=restaurant"
  );
  const supermarche = await axios.default.get(
    "https://data.opendatasoft.com/api/records/1.0/search/?dataset=osm-shop-fr%40babel&q=&lang=fr&facet=type&facet=brand&facet=wheelchair&facet=commune&refine.commune=" +
      req.params.cityName +
      "&refine.type=supermarket"
  );

  return res
    .status(200)
    .json({
      pharmacie: {
        pharmacie: pharmacie.data["records"],
        length: pharmacie.data["nbhits"],
      },
      postes: { postes: postes.data["records"], length: postes.data["nhits"] },
      banques: {
        banques: banques.data["records"],
        length: banques.data["nhits"],
      },
      restaurants: {
        restaurants: restaurants.data["records"],
        length: restaurants.data["nhits"],
      },
      supermarche: {
        supermarche: supermarche.data["records"],
        length: supermarche.data["nhits"],
      },
    });
});
app.listen(3032, async () => {
  serviceStorage.saveFile(3032);
  apiGateway = serviceStorage.getApiGateway();
  console.log("AllAboutCityService started and stored");
});
