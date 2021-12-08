const express = require("express");
const axios = require("axios").default;
const serviceStorage = require("../storage/service_storage");
const router = express.Router();
const { sign } = require("jsonwebtoken");
let apiGateway = serviceStorage.getApiGateway();
const secret = "21SD1S11SD1S1S2"; // on obtiendra la clé par var env. (process.env.SECRET_KEY)
/**
 * fait la recherche city en fonction des preferences utilisateur
 * doit récuperer : allaboutcity, location si location demandée, meteo, flight ticket, train, hotel
 */

const generateTokenAuthentification = (req) => {
  const token = sign(req.body ?? req.config, secret);
  return token;
};

router.post("/search/:cityName", async (req, res, next) => {
  const cityInfo = req.params.cityName;

  const token = generateTokenAuthentification(req);
  let headers = { headers: { Authorization: "Bearer " + token } };
  let city,
    locationInfo,
    location,
    distanceReq,
    distance,
    userInfo,
    meteoInfo,
    allaboutcity;
  userInfo = req.body.userId;

  let pref;
  try {
    pref = await axios.get(
      apiGateway + "/user-service/getPreferences/" + userInfo,
      headers
    );
  } catch (err) {
    
  }
  console.log("pef" + pref);
  try {
    locationInfo = await axios.get(
      apiGateway + "/location-service/location",
      headers
    );
    location = locationInfo.data.city;
  } catch (err) {
    location={}
  }
  const { allow_regions_only, exclude_city } = pref.data;

  let newsInfo;
  try {
    newsInfo = await axios.get(
      apiGateway + "/news-service/" + cityInfo,
      headers
    );
  } catch (err) {
    newsInfo = {data:{}}
  }
  //meteo call
  try {
    meteoInfo = await axios.get(
      apiGateway + "/meteo-service/" + cityInfo,
      headers
    );
  
  } catch (err) {
    meteoInfo = {data:{}}
  }
  let allabout;
  try {
    allabout = await axios.get(
      apiGateway + "/allaboutcity-service/" + cityInfo,
      headers
    );
  } catch (err) {
    console.log(err);
  }

  return res
    .status(200)
    .json({
      ...meteoInfo.data,
      city: cityInfo,
      ...newsInfo.data,
      allaboutcity: { ...allabout.data },
    });
});

router.post("/search", async (req, res, next) => {
  const token = generateTokenAuthentification(req);
  let headers = { headers: { Authorization: "Bearer " + token } };
  const city = await axios.get(
    apiGateway + "/location-service/location",
    headers
  );
  const cityInfo = city.data.city;

  let locationInfo,
    location,
    distanceReq,
    distance,
    userInfo,
    meteoInfo,
    allaboutcity;
  userInfo = req.body.userId;
  console.log("userinfo " + userInfo);
  console.log(apiGateway);
  console.log(req.headers.authorization);
  let pref;
  try {
    pref = await axios.get(
      apiGateway + "/user-service/getPreferences/" + userInfo,
      headers
    );
  } catch (err) {
    console.log(err);
  }
  console.log("pef" + pref);

  const { allow_regions_only, exclude_city } = pref.data;

  let newsInfo;
  try {
    newsInfo = await axios.get(
      apiGateway + "/news-service/" + cityInfo,
      headers
    );
  } catch (err) {
    console.log("news");
  }
  //meteo call
  try {
    meteoInfo = await axios.get(
      apiGateway + "/meteo-service/" + cityInfo,
      headers
    );
    //allaboutcity and flightbooking, flixbus need
  } catch (err) {
    console.log("meteo");
  }
  let allabout;
  try {
    allabout = await axios.get(
      apiGateway + "/allaboutcity-service/" + cityInfo,
      headers
    );
  } catch (err) {
    console.log("allaboutcity");
  }
  return res
    .status(200)
    .json({
      ...meteoInfo.data,
      city: cityInfo,
      ...newsInfo.data,
      allaboutcity: { ...allabout.data },
    });
});

router.post("/decouverte", async (req, res, next) => {
  let prefOk = false;
  const token = generateTokenAuthentification(req);
  let headers = { headers: { Authorization: "Bearer " + token } };
  let city,
    cityInfo,
    locationInfo,
    location,
    distanceReq,
    distance,
    userInfo,
    meteoInfo,
    allaboutcity;
  userInfo = req.body.userId;
  console.log("userinfo " + userInfo);
  const pref = await axios.get(
    apiGateway + "/user-service/getPreferences/" + userInfo,
    headers
  );
  console.log("pef" + pref);
  locationInfo = await axios.get(
    apiGateway + "/location-service/location",
    headers
  );
  location = locationInfo.data.city;
  const { allow_regions_only, exclude_city } = pref.data;
  //We test in 2000 cities
  let i = 0;
  while (!prefOk && i < 2) {
    try {
      city = await axios.get(
        apiGateway + "/cityinfo-service/randomCity",
        headers
      );
      cityInfo = city.data;

      let region = await axios.get(
        apiGateway + "/cityinfo-service/" + cityInfo + "/region",
        headers
      );
      let regionData = region.data;
      if (allow_regions_only.length === 0) {
        if (exclude_city.length == 0) {
          prefOk = true;
        } else if (!exclude_city.includes(cityInfo)) {
          prekOk = true;
        }
      } else {
        if (
          allow_regions_only.includes(regionData) &&
          !exclude_city.includes(cityInfo)
        ) {
          prefOk = true;
        }
      }
      i++;
      console.log(i);
    } catch (err) {
      return res.status(500).json({ error: "Error in random city" });
    }
  }

  cityInfo = location;
  let newsInfo = await axios.get(
    apiGateway + "/news-service/" + cityInfo,
    headers
  );
  //meteo call
  meteoInfo = await axios.get(
    apiGateway + "/meteo-service/" + cityInfo,
    headers
  );
  //allaboutcity and flightbooking, flixbus need

  return res
    .status(200)
    .json({ ...meteoInfo.data, city: cityInfo, ...newsInfo.data });
  // random city using preferences.
});

module.exports = router;
