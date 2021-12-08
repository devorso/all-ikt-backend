/**
 * Gateway System by Ismail Dinc & Mustan Koc.
 * The first goal is manage services and manage authorization access.
 */

const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const { sign, verify } = require("jsonwebtoken");
const serviceStorage = require("./storage/service_storage");
const app = express();
const secret = "21SD1S11SD1S1S2"; // for between services
var privateKey = "HELLO_PK"; // between user and gateway
let services = []; // list services host with object type {name:"", link:""}
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const jwtAuthentification = (data) => {
  try {
    var token = sign(data, privateKey, { expiresIn: "4h" });
    return token;
  } catch (err) {
    console.log(err);
  }
};

const checkAuthJWTServices = async (token, res) => {
  try {
    await verify(token, secret);
    return true;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ error: "expired" });
    }
    return false;
  }
};
const checkAuthJWT = async (token) => {
  try {
    await verify(token, privateKey);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
app.post("/login", async (req, res, next) => {
  const service = services.find((s) => s.name === "user-service");
  // we must request for get user info to userinfoservice
  /**
   * Pourquoi la connexion est sur Api gateway ?
   * car l'authentification utilisateur sera géré par le gateway.
   *
   */
  const token = generateTokenAuthentification(req);
  console.log(token);
  try {
    const result = await axios.post(service.link + "/isRealUser", req.body, {
      headers: { Authorization: "Bearer " + token },
    });
    console.log(result);
    if (result.data.type === "auth_success") {
      // auth success
      //generate token
      const newToken = await jwtAuthentification({
        user: { ...req.body, _id: result.data.user._id },
      });
      console.log(newToken);
      return res
        .status(200)
        .json({
          type: "auth_success",
          token_bearer: newToken,
          user: result.data.user,
        });
    } else {
      return res
        .status(403)
        .json({ message: "Authentification failed!", type: "auth_failed" });
    }
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Authentification failed!", type: "auth_failed", err });
  }
});
app.use(async (req, res, next) => {
  //test auth user - gateway and services- gateway

  if (
    req.headers.authorization !== undefined &&
    req.headers.authorization.split(" ").length > 0
  ) {
    if (
      req.headers.authorization !== undefined &&
      (await checkAuthJWT(req.headers.authorization.split(" ")[1]))
    ) {
      next();
    } else {
      console.log(
        "ggfgfg",
        await checkAuthJWTServices(req.headers.authorization.split(" ")[1], res)
      );
      if (
        await checkAuthJWTServices(req.headers.authorization.split(" ")[1], res)
      ) {
        next();
      } else {
        return res
          .status(403)
          .json({ message: "Not logged or JWT expired.", error: "not_logged" });
      }
    }
  } else {
    return res.status(400).json({ error: "authorization_empty" });
  }
});
fs.watchFile(
  "../hosts.json",
  {
    bigint: false,

    persistent: true,

    interval: 4000,
  },
  (curr, prev) => {
    console.log(
      "The file hosts has been modified. Update the array of services storages...OK"
    );
    const data = JSON.parse(fs.readFileSync("../hosts.json", "utf8"));
    services = [];
    for (const [key, value] of Object.entries(data)) {
      services.push({ name: key, link: value });
    }
    console.log(services);
  }
);


const generateTokenAuthentification = (req) => {
  const token = sign(req.body ?? req.config, secret);
  return token;
};


app.use("/:service/*", async (req, res, next) => {
  try {
    const serviceAssocie = services.find((s) => s.name === req.params.service);
    if (req.method === "GET") {
      next();
    }
    if (req.method === "POST") {
      const pathAfterService = req.baseUrl.split(`/${req.params.service}/`)[1];

      return await managePostRequest(
        req,
        res,
        next,
        serviceAssocie,
        pathAfterService
      );
    }
  } catch (err) {
    next({
      message: "An error has been occured with the service",
      service: req.params.service,
      err: err,
    });
  }
});

app.get("/:service/*", async (req, res, next) => {
  const token = generateTokenAuthentification(req);
  const serviceAssocie = services.find((s) => s.name === req.params.service);
  if (serviceAssocie != null) {
    const pathAfterService = req.path.split(`/${req.params.service}/`)[1];
    try {
      var result = await axios.get(
        serviceAssocie.link + "/" + pathAfterService,
        { headers: { Authorization: "Bearer " + token } }
      );

      return res.status(201).json(result.data);
    } catch (err) {
      console.log(err);
      next({ service: req.params.service, err: err.toString() });
    }
  }
});
const managePostRequest = async (req, res, next, serviceInfo, path) => {
  const token = generateTokenAuthentification(req);
  var result = await axios.post(serviceInfo.link + "/" + path, req.body, {
    headers: {
      authorization: "Bearer " + token,
      infouser: req.headers.authorization.split(" ")[1],
    },
  });

  return res.status(201).json(result.data);
};

app.use((err, req, res, next) => {
  if (err.code === "ERR_HMAC_AUTH_INVALID") {
    res.status(401).json({
      error: "Invalid request",
      info: err.message,
    });
  }
  return res.status(500).json(err);
});

app.listen(8000, () => {
  serviceStorage.saveFile(8000);
  console.log("API Gateway started.");
});
