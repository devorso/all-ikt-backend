const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const User = require('../models/User')

router.post("/addFavourite", async (req, res, next) => {
  const { userId, city } = req.body;
  let user = await User.findById({ _id: userId });
  let exist = false
  
  if (user.favouritesCity !== undefined && user.favouritesCity.length > 0) {
    for (let f in user.favouritesCity) {
      if (f === city){
        exist = true
      }
    }
    if (!exist) {
      user.favouritesCity.push(city);
    }
  } else {
    user.favouritesCity = [city];
  }
  console.log('fav')
  try {
    await user.save();
    return res.status(201).json({ message: "Updated", user });
  } catch (err) {
      console.log(err)
    return res
      .status(500)
      .json({
        message: "An error has been occured with the save favourite item",
        error: "error_db_save_favourite",
      });
  }
});

router.post("/deleteFavourite", async (req, res, next) => {
  const { userId, city } = req.body;
  let user = await User.findById({ _id:userId });
  if (user.favouritesCity !== undefined && user.favouritesCity.length > 0) {
    user.favouritesCity = user.favouritesCity.filter((e) => e !== city);
  }
  try {
    await user.save();
    return res.status(201).json({ message: "Updated", user });
  } catch (err) {
    return res
      .status(500)
      .json({
        message: "An error has been occured with the save favourite item",
        error: "error_db_save_favourite",
      });
  }
});

module.exports = router;
