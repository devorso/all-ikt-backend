const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String },
  regionName: { type: String },
  randomSelected: { type: Boolean },
});

module.exports = mongoose.model("City", schema);
