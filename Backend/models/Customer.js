// models/Customer.js
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  billingAddress: String,
  deliveryAddress: String,
  gst: String,
  email: String
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
