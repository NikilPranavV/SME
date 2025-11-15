
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  rawMaterialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RawMaterial",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "sent"],
    default: "pending",
  },
  notes: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Order", orderSchema);
