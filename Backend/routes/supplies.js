const express = require('express');
const router = express.Router();
const supplyController = require('../controllers/supplyController');

router.get('/', supplyController.getAllSupplyLogs);
router.post('/', supplyController.createSupplyLog);

module.exports = router;
