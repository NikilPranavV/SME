// models/Action.js
const mongoose = require("mongoose");

const actionSchema = new mongoose.Schema({
  customerUUID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  productUUID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  actionUUID: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Action", actionSchema);
