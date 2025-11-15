// models/machineModel.js
const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema({
  machineName: { type: String, required: true },
  machineType: { type: String, required: true },
  capacity: String,
  location: String,
  status: { type: String, default: "Active" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Machine", machineSchema);
