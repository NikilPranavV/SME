const mongoose = require("mongoose");

const machineUsageSchema = new mongoose.Schema(
  {
    usageId: { type: String, required: true, unique: true },
    machine: { type: mongoose.Schema.Types.ObjectId, ref: "Machine", required: true }, // reference existing machine
    input: { type: Number, required: true },
    output: { type: Number, required: true },
    wastage: { type: Number, required: true }, // auto-calculated
    operator: { type: String, required: true },
    productionDate: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

const MachineUsage = mongoose.model("MachineUsage", machineUsageSchema);
module.exports = MachineUsage;
