// routes/product.routes.js
const router = require("express").Router();
const controller = require("../controllers/product.controller");

router.post("/", controller.createProduct);

module.exports = router;
