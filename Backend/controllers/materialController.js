const RawMaterial = require('../models/RawMaterial');
const { sendWhatsAppMessage } = require('../utils/whatsapp');

const LOW_STOCK_THRESHOLD = 100;

//Utility: check stock & trigger WhatsApp alert
const checkAndSendLowStockAlert = async (material) => {
  if (material.quantity < LOW_STOCK_THRESHOLD) {
    const alertMessage = `Low Stock Alert!\nMaterial: ${material.name}\nRemaining Quantity: ${material.quantity}`;
    try {
      await sendWhatsAppMessage(alertMessage);
      console.log(`WhatsApp alert sent for ${material.name}`);
    } catch (err) {
      console.error(`Failed to send WhatsApp alert for ${material.name}:`, err.message);
    }
  }
};

//GET all raw materials
const getAllRawMaterials = async (req, res) => {
  try {
    const materials = await RawMaterial.find();
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//CREATE new raw material
const createRawMaterial = async (req, res) => {
  const { name, quantity } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Material name is required' });
  }

  try {
    const existing = await RawMaterial.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Material already exists' });
    }

    const material = new RawMaterial({
      name,
      quantity: quantity !== undefined ? quantity : 0
    });

    await material.save();

    //Check stock after creation
    await checkAndSendLowStockAlert(material);

    res.status(201).json(material);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//GET material by ID
const getRawMaterialById = async (req, res) => {
  try {
    const material = await RawMaterial.findById(req.params.id);
    if (!material) return res.status(404).json({ message: 'Raw material not found' });
    res.json(material);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//UPDATE material
const updateRawMaterial = async (req, res) => {
  try {
    const material = await RawMaterial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!material) return res.status(404).json({ message: 'Raw material not found' });

    //Check stock after update
    await checkAndSendLowStockAlert(material);

    res.json(material);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//DELETE material
const deleteRawMaterial = async (req, res) => {
  try {
    const material = await RawMaterial.findByIdAndDelete(req.params.id);
    if (!material) return res.status(404).json({ message: 'Raw material not found' });
    res.json({ message: 'Raw material deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//REDUCE quantity and trigger WhatsApp alert if low
const reduceRawMaterialQuantity = async (req, res) => {
  try {
    const { material, quantity } = req.body;

    if (!material || !quantity) {
      return res.status(400).json({ message: 'Material name and quantity are required' });
    }

    const rawMaterial = await RawMaterial.findOne({ name: material });

    if (!rawMaterial) {
      return res.status(404).json({ message: 'Raw material not found' });
    }

    if (rawMaterial.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    rawMaterial.quantity -= quantity;
    await rawMaterial.save();

    //Check and alert if stock low
    await checkAndSendLowStockAlert(rawMaterial);

    res.json({
      message: `Reduced ${quantity} from ${material}`,
      updatedMaterial: rawMaterial
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//NEW: GET only low-stock materials (for frontend alerts page)
const getLowStockMaterials = async (req, res) => {
  try {
    const lowStockMaterials = await RawMaterial.find({ quantity: { $lt: LOW_STOCK_THRESHOLD } });
    res.json(lowStockMaterials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllRawMaterials,
  createRawMaterial,
  getRawMaterialById,
  updateRawMaterial,
  deleteRawMaterial,
  reduceRawMaterialQuantity,
  getLowStockMaterials 
};
