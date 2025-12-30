// controllers/product.controller.js
const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
};
