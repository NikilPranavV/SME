const SupplyLog = require('../models/SupplyLog');
const Supplier = require('../models/Supplier');
const RawMaterial = require('../models/RawMaterial');

const createSupplyLog = async (req, res) => {
  const { supplierId, rawMaterialId, quantitySupplied, price } = req.body;

  try {
    const supplier = await Supplier.findById(supplierId);
    const rawMaterial = await RawMaterial.findById(rawMaterialId);

    if (!supplier || !rawMaterial) {
      return res.status(404).json({ message: 'Supplier or Raw Material not found' });
    }

    const supplyLog = new SupplyLog({
      supplier: supplierId,
      rawMaterial: rawMaterialId,
      quantitySupplied,
      price,
    });

    await supplyLog.save();

    rawMaterial.quantity += quantitySupplied;
    await rawMaterial.save();

    res.status(201).json(supplyLog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create supply log' });
  }
};

const getAllSupplyLogs = async (req, res) => {
  try {
    const supplyLogs = await SupplyLog.find()
      .populate('supplier', 'name contact')
      .populate('rawMaterial', 'name quantity');
    res.json(supplyLogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve supply logs' });
  }
};

const getSupplyLogById = async (req, res) => {
  try {
    const supplyLog = await SupplyLog.findById(req.params.id)
      .populate('supplier', 'name contact')
      .populate('rawMaterial', 'name quantity');
    if (!supplyLog) {
      return res.status(404).json({ message: 'Supply log not found' });
    }
    res.json(supplyLog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve supply log' });
  }
};

module.exports = {
  createSupplyLog,
  getAllSupplyLogs,
  getSupplyLogById,
};
