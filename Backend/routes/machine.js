const express = require("express");
const router = express.Router();
const { addMachine, getMachines } = require("../controllers/machineContoller");

// POST → Add Machine
router.post("/add", addMachine);

// GET → Retrieve All Machines
router.get("/", getMachines);

module.exports = router;
