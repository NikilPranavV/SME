// controllers/action.controller.js
const Action = require("../models/Action");

exports.createAction = async (req, res) => {
  const { customerUUID, productUUID, actionUUID } = req.body;

  const action = new Action({
    customerUUID,
    productUUID,
    actionUUID
  });

  await action.save();
  res.status(201).json(action);
};

exports.getActionsByCustomer = async (req, res) => {
  const actions = await Action.find({
    customerUUID: req.params.customerId
  })
    .populate("customerUUID")
    .populate("productUUID");

  res.status(200).json(actions);
};
