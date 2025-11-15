const express = require('express');
const router = express.Router();
const {
  getAllRawMaterials,
  createRawMaterial,
  getRawMaterialById,
  updateRawMaterial,
  deleteRawMaterial,
  reduceRawMaterialQuantity,
  getLowStockMaterials
} = require('../controllers/materialController');

router.get('/', getAllRawMaterials);
router.post('/', createRawMaterial);
router.get('/:id', getRawMaterialById);
router.put('/:id', updateRawMaterial);
router.delete('/:id', deleteRawMaterial);
router.post('/reduce', reduceRawMaterialQuantity);

//new route
router.get('/:id/low-stock', getLowStockMaterials);

module.exports = router;
