const fs = require("fs");

module.exports = {
  saveFile: (port) => {
    const dataFile = JSON.parse(fs.readFileSync("../hosts.json"));

    fs.writeFileSync(
      "../hosts.json",
      JSON.stringify({ ...dataFile, "api-gateway": "http://localhost:" + port })
    );
  },
  getApiGateway: () => {
    const dataFile = JSON.parse(fs.readFileSync("../hosts.json"));
    return dataFile["api-gateway"];
  },
};
