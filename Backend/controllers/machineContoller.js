const Machine = require("../models/machine"); // your Mongoose schema

// ------------------------
// ✅ Add Machine
// ------------------------
const addMachine = async (req, res) => {
  try {
    const { machineName, machineType, capacity, location, status } = req.body;

    if (!machineName || !machineType) {
      return res.status(400).json({ message: "Machine name and type are required." });
    }

    const newMachine = new Machine({
      machineName,
      machineType,
      capacity,
      location,
      status: status || "Active",
      createdAt: new Date(),
    });

    const savedMachine = await newMachine.save();

    res.status(201).json({
      message: "Machine details added successfully.",
      data: savedMachine,
    });
  } catch (error) {
    console.error("Error adding machine:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ------------------------
// ✅ Get All Machines
// ------------------------
const getMachines = async (req, res) => {
  try {
    const machines = await Machine.find().sort({ createdAt: -1 });
    res.status(200).json(machines);
  } catch (error) {
    console.error("Error fetching machines:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addMachine, getMachines };
