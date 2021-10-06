const mongoose = require("mongoose");
const dataschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    default: "lol",
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  checkInHrs: {
    type: Number,
    min: 0,
    max: 23,
    required: true,
  },
  checkInMins: {
    type: Number,
    min: 0,
    max: 59,
    required: true,
  },
  checkOutHrs: {
    type: Number,
    min: 0,
    max: 23,
  },
  checkOutMins: {
    type: Number,
    min: 0,
    max: 59,
  },
  status: {
    type: String,
    default: "Present",
  },
});
const Data = mongoose.model("Data", dataschema);
module.exports = Data;
