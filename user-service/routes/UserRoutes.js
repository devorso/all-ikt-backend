const express = require("express");
const User = require("../models/User");
const mongoose = require("mongoose");
const UserPreferences = require("../models/UserPreferences");
const router = express.Router();
const jwt = require("jsonwebtoken");
var privateKey = "HELLO_PK"; // between user and gateway

router.post("/createUser", async (req, res, next) => {
  // check validity with express error middleware

  const {
    username,
    firstname,
    lastname,
    email,
    password,
    birthDate,
    phoneNumber,
    city,
    preferences,
  } = req.body["body"] === undefined ? req.body : req.body["body"];

  const user = await User.findOne({ username });
  console.log(user);
  if (user !== null) {
    return res.status(200).json({ error: "exist_username" });
  }
  const userTestEmail = await User.findOne({ email });

  if (userTestEmail !== null) {
    return res.status(200).json({ error: "exist_email" });
  }
  let preferencesUser = new UserPreferences({
    allow_regions_only: [],
    exclude_city: [],
  });
  await preferencesUser.save();
  let u = new User({
    firstname: firstname,
    lastname: lastname,
    username: username,
    email: email,
    bithday: birthDate,
    city: city,
    numberPhone: phoneNumber,
    preferences: preferencesUser,
  });
  // hash password.
  u.setPassword(password);
  await u.save();
  return res.status(200).json({ type: "ok", user: u });
});

router.get("/user/:id", async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id }).populate(
    "preferences"
  );
  return res.status(200).json(user);
});

router.post("/updateSettings/:userId", async (req, res, next) => {
  const tokenAuthUser = req.headers.infouser;

  try {
    const data = await jwt.verify(tokenAuthUser, privateKey);

    //SECURITY We check the auth token if the userid == userId in params and accept the modification only if it correct.?
    if (data.user._id === req.params.userId) {
      const u = await User.findOne({ _id: data.user._id });

      if (u !== undefined) {
        u.firstname = req.body.firstname;
        u.lastname = req.body.lastname;
        u.username = req.body.username;
        u.numberPhone = req.body.numberPhone;
        u.city = req.body.city;
        u.email = req.body.email;
        await u.save();
        return res.status(200).json({ message: "ok" });
      }
    }
    return res
      .status(403)
      .json({ error: "forbidden", message: "You are not authorized." });
  } catch (err) {
    return res.status(500).json({ message: "Error", err });
  }
});

router.post("/updatePassword/:userId", async (req, res, next) => {
  const tokenAuthUser = req.headers.infouser;

  try {
    const data = await jwt.verify(tokenAuthUser, privateKey);

    //SECURITY We check the auth token if the userid == userId in params and accept the modification only if it correct.?
    if (data.user._id === req.params.userId) {
      const u = await User.findOne({ _id: data.user._id });
      const { password, newPass, newPass2 } = req.body;
      if (u !== undefined) {
        if (!u.validPassword(password)) {
          return res.status(500).json({ err: "not_same_password" });
        }
        u.setPassword(newPass);
        await u.save();
        return res.status(200).json({ message: "ok" });
      }
    }
    return res
      .status(403)
      .json({ error: "forbidden", message: "You are not authorized." });
  } catch (err) {
    return res.status(500).json({ message: "Error", err });
  }
});

router.post("/isRealUser", async (req, res, next) => {
  // we check if username and password is entered correctly
  // and then send info user to gateway
  const { username, password } = req.body;
  console.log(req.body);
  const user = await User.findOne({ username: username }).populate(
    "preferences"
  );
  console.log(user);
  if (user !== undefined) {
    console.log(user.validPassword(password));
    if (user.validPassword(password)) {
      return res.status(200).json({ user, type: "auth_success" });
    }
  } else {
    return res
      .status(403)
      .json({ message: "Authentification failed", type: "auth_failed" });
  }
  return res
    .status(403)
    .json({ message: "Authentification failed", type: "auth_failed" });
});

module.exports = router;
