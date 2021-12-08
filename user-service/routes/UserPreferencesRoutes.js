const express = require("express");
const User = require("../models/User");
const UserPreferences = require("../models/UserPreferences");
const { ObjectId } = require("mongoose");
const router = express.Router();

router.post("/updatePreferences/:userId", async (req, res, next) => {
  const { allow_regions_only, exclude_city } = req.body;
  try {
    let user = await User.findOne({ _id: req.params.userId }).populate(
      "preferences"
    );
    console.log(user);
    if (user.preferences === undefined) {
      let up = new UserPreferences({
        allow_regions_only: allow_regions_only.map((e) => e.value),
        exclude_city: exclude_city.map((e) => e.value),
      });
      await up.save();
      user.preferences = up;
    } else {
      user.preferences.allow_regions_only = allow_regions_only.map(
        (e) => e.value
      );
      user.preferences.exclude_city = exclude_city.map((e) => e.value);
    }
    await user.preferences.save();
    await user.save();
    return res.status(200).json({ message: "ok" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Une erreur est survenue" });
  }
});

router.get("/getPreferences/:userId", async (req, res, next) => {
  console.log("hoo");
  const userInfo = await User.findOne({ _id: req.params.userId }).populate(
    "preferences"
  );
  console.log(userInfo);
  return res.status(200).json(userInfo.preferences);
});

module.exports = router;
