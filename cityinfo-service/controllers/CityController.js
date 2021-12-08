const express = require("express");
const router = express.Router();
const cityMethods = require("../methods/city_methods");
const listRegions = require("../data/regions.json");
const listCity = require("../data/city.json");
const mongoose = require("mongoose");
const City = require("../models/City");

// on stocke la liste des fichiers qu'on a déjà choisi
router.get("/randomCity", async (req, res, next) => {
  return res.status(200).json(await cityMethods.getCity());
});
// Distance entre deux villes
router.get("/distance/:cityA/:cityB", async (req, res, next) => {
  return res
    .status(200)
    .json({
      distance: await cityMethods.distanceBetween(
        req.params.cityA,
        req.params.cityB
      ),
    });
});
router.get("/isRealCity/:city", async (req, res, next) => {
  let ok = false;
  listCity.forEach((c) => {
    if (c.name.toLowerCase() === req.params.city.toLowerCase()) {
      ok = true;
    }
  });
  return res.status(200).json({ exist: ok });
});
//Region dans laquelle la ville cityName appartient
router.get("/:cityName/region", (req, res, next) => {
  const cityName = req.params.cityName;
  return res
    .status(201)
    .json({ result: { region: cityMethods.getRegionByCityName(cityName) } });
});
router.get("/listRegions/:startWith", async (req, res, next) => {
  const uniq = [];
  const filter = [];
  listRegions.forEach((e) => {
    if (e.region_name !== undefined && !uniq.includes(e.region_name)) {
      uniq.push(e.region_name);
    }
  });

  uniq.forEach((e) => {
    if (e.toLowerCase().search(req.params.startWith) >= 0) filter.push(e);
  });
  return res.status(200).json({ regions: filter });
});
router.get("/listCity/:startWith", async (req, res, next) => {
  const uniq = [];
  console.log("ooo");
  const filter = [];
  const cities = await City.find();
  for await (const city of cities) {
    if (
      !filter.includes(city.name) &&
      city.name.search(req.params.startWith) >= 0
    ) {
      filter.push(city.name);
    }
  }
  console.log(filter);
  return res.status(200).json({ cities: filter });
});
router.get("/listRegions", async (req, res, next) => {
  const uniq = [];
  listRegions.forEach((e) => {
    if (!uniq.includes(e.region_name)) {
      uniq.push(e.region_name);
    }
  });
  return res.status(200).json({ regions: uniq });
});

router.get("/listCity", async (req, res, next) => {
  const uniq = [];
  const cities = await City.find();

  return res.status(200).json({ cities: cities.map((e) => e.name) });
});

module.exports = router;
