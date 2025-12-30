// controllers/customer.controller.js
const Customer = require("../models/Customer");

exports.getCustomers = async (req, res) => {
  const customers = await Customer.find();
  res.status(200).json(customers);
};

exports.createCustomer = async (req, res) => {
  const customer = new Customer(req.body);
  await customer.save();
  res.status(201).json(customer);
};
