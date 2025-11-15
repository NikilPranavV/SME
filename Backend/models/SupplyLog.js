const mongoose = require('mongoose');

const supplyLogSchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier', 
    required: true,
  },
  rawMaterial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RawMaterial', 
    required: true,
  },
  quantitySupplied: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  dateSupplied: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const SupplyLog = mongoose.model('SupplyLog', supplyLogSchema);

module.exports = SupplyLog;
