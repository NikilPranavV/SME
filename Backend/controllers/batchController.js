const MachineUsage = require("../models/batch");
const Machine = require("../models/machine");

// ✅ Get all machine usages
const getMachineUsages = async (req, res) => {
  try {
    const usages = await MachineUsage.find()
      .populate("machine", "machineName machineType") // populate machine info
      .sort({ createdAt: -1 });
    res.json(usages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Create new usage (calculate wastage)
const createMachineUsage = async (req, res) => {
  const { usageId, machine, input, output, operator, productionDate } = req.body;

  try {
    const exists = await MachineUsage.findOne({ usageId });
    if (exists) return res.status(400).json({ message: "Usage already exists" });

    const wastage = Math.max(0, input - output);

    const newUsage = await MachineUsage.create({
      usageId,
      machine,
      input,
      output,
      wastage,
      operator,
      productionDate: productionDate || Date.now(),
    });

    const populatedUsage = await newUsage.populate("machine", "machineName machineType");

    res.status(201).json(populatedUsage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update usage
const updateMachineUsage = async (req, res) => {
  try {
    const usage = await MachineUsage.findById(req.params.id);
    if (!usage) return res.status(404).json({ message: "Usage not found" });

    Object.assign(usage, req.body);

    if (req.body.input !== undefined || req.body.output !== undefined) {
      const input = req.body.input ?? usage.input;
      const output = req.body.output ?? usage.output;
      usage.wastage = Math.max(0, input - output);
    }

    const updated = await usage.save();
    const populated = await updated.populate("machine", "machineName machineType");

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete usage
const deleteMachineUsage = async (req, res) => {
  try {
    const usage = await MachineUsage.findById(req.params.id);
    if (!usage) return res.status(404).json({ message: "Usage not found" });

    await usage.deleteOne();
    res.json({ message: "Machine usage deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMachineUsages,
  createMachineUsage,
  updateMachineUsage,
  deleteMachineUsage,
};
