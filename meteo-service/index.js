const express = require("express");
const fs = require("fs");
const cors = require("cors");
const crypto = require("crypto");
const app = express();
const axios = require("axios");
const serviceStorage = require("./storage/service_storage");
let apiGateway;
const getMeteoInfo = async (city) => {
  const responseLocation = await axios.default.get('http://dataservice.accuweather.com/locations/v1/cities/search?q=' + 
  city + 
  '&language=fr&apikey=mVGA7ByftJzsjaVyW9gbZ4SxZqwJTmCk');
    //mVGA7ByftJzsjaVyW9gbZ4SxZqwJTmCk
    //http://dataservice.accuweather.com/locations/v1/cities/search?q=Metz&language=fr&apikey=mVGA7ByftJzsjaVyW9gbZ4SxZqwJTmCk
    //http://dataservice.accuweather.com/forecasts/v1/daily/5day/135029?language=fr&metric=true&apikey=mVGA7ByftJzsjaVyW9gbZ4SxZqwJTmCk
    const keyLocation = responseLocation.data[0].Key;
    
    const response = await axios.default.get('http://dataservice.accuweather.com/forecasts/v1/daily/5day/' + keyLocation + '?language=fr&metric=true&apikey=mVGA7ByftJzsjaVyW9gbZ4SxZqwJTmCk');
    console.log(response.data);
    if (response.status === 404) {
        return ""
    }
    return response.data;
};

app.use(
  cors({origin: apiGateway}
    )
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
