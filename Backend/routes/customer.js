// routes/customer.routes.js
const router = require("express").Router();
const controller = require("../controllers/customer.controller");

router.get("/", controller.getCustomers);
router.post("/", controller.createCustomer);

module.exports = router;
