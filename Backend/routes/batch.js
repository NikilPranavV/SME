const express = require("express");
const router = express.Router();
const {
  getMachineUsages,
  createMachineUsage,
  updateMachineUsage,
  deleteMachineUsage,
} = require("../controllers/batchController");

// CRUD routes
router.get("/", getMachineUsages);
router.post("/add", createMachineUsage);
router.put("/:id", updateMachineUsage);
router.delete("/:id", deleteMachineUsage);

module.exports = router;
