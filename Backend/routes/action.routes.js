// routes/action.routes.js
const router = require("express").Router();
const controller = require("../controllers/action.controller");

router.post("/", controller.createAction);
router.get("/customer/:customerId", controller.getActionsByCustomer);

module.exports = router;
