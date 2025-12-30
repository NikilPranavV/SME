// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  sizeMm: Number,
  ash: String,
  burnTime: String,
  customSpecificationEnabled: Boolean,
  customSpecification: String,
  quantity: Number,
  cost: Number,
  expectedDeliveryDate: Date
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
