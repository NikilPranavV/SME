
const rawmaterial = require("../models/RawMaterial");
const supplier = require("../models/Supplier")
const Order = require("../models/Order");
const sendMail = require("../utils/sendMail");

const getOrder = async (req,res) => {
    try{
        const orders = await Order.find();
        res.json({orders});
    }
    catch(err){
        res.status(400).json({message : err.message})
    }
};

const createOrder = async (req,res) => {
    const {supplierId,rawMaterialId,quantity, orderDate, status, notes} = req.body;

    try{
        const add = new Order({supplierId,rawMaterialId,quantity, orderDate, status, notes});
        await add.save();

        const supplierfound = await supplier.findById(supplierId);
        const rawmaterialfound = await rawmaterial.findById(rawMaterialId)

        const subject = "hello";
        const body = `hello supplier ${supplierfound.name} i need ${rawmaterialfound.name} `;

        await sendMail(supplierfound.email, subject, body);

        Order.status = "sent";

        await Order.save();

        res.status(201).json({ message: "Order created and email sent", order: add });

      }
    catch(err){
        res.status(400).json({message: err.message})
    }
};

const getOrderById = async (req,res) => {
    try{
        const orders = await Order.findById(req.params.id);
        if(!orders){
            res.status(404).json("Order not found");
        }
        res.json({orders});
    }
    catch(err){
        res.status(400).json({message : err.message})
    }
};

const updateOrder = async (req,res) => {
    try{
        const orders = await Order.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!orders){
            res.status(404).json("Order not found");
        }
        res.json({orders});
    }
    catch(err){
        res.status(400).json({message : err.message})
    }
};

const deleteOrder = async (req,res) => {
    try{
        const orders = await Order.findByIdAndDelete(req.params.id, req.body, {new: true});
        if(!orders){
            res.status(404).json("Order not found");
        }
        res.json({orders});
    }
    catch(err){
        res.status(400).json({message : err.message})
    }
};

module.exports = {getOrder,createOrder,getOrderById,updateOrder,deleteOrder};