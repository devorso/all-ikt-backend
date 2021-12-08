const fs = require("fs");
const crypto = require("crypto");
const axios = require("axios");
const path = require("path");
const listCityFile = require("../data/city.json");
const listRegions = require("../data/regions.json");
let randomCityUsed = require("../data/city_selected.json");
const pathCityUsed =
  path.resolve(__dirname, "..", "data") + "/city_selected.json";
const listCity = listCityFile;

module.exports = {
  getRegionByCityName: (city) => {
    let depCode;

    listCityFile.forEach((e) => {
      console.log(e);
      if (e.name === city) {
        depCode = e.department_code;
      }
    });
    let region;
    if (listRegions.length > 0) {
      region = listRegions.filter((e) => e.num_dep === depCode)[0];
    }

    if (region === undefined) {
      return null;
    }
    console.log(region);
    return region.region_name;
  },
  distanceBetween: async (cityA, cityB) => {
    //api down
    //const responseData =await axios.default.get('https://www.distance24.org/route.json?stops='+ cityA+'|'+ cityB)
    let distance = 600;

    return distance;
  },
  getCity: () => {
    if (listCity.length === randomCityUsed.length) {
      fs.writeFileSync(pathCityUsed, JSON.stringify([]), { flag: "w" });
      randomCityUsed = [];
    }
    let canUsed = true;
    let citySelect;
    do {
      const numberRandom = crypto.randomInt(0, listCity.length);

      citySelect = listCity[numberRandom];
      canUsed = true;
      randomCityUsed.forEach((e) => {
        if (e === citySelect) {
          canUsed = false;
        }
      });
    } while (!canUsed);
    fs.writeFileSync(
      pathCityUsed,
      JSON.stringify([...randomCityUsed, citySelect.name]),
      { flag: "w+" }
    );
    randomCityUsed.push(citySelect.name);
    return citySelect.name;
  },
};
