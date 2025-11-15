const dotenv = require("dotenv").config();
const express = require('express');
const connectDb = require("./config/db");
const cors = require('cors');
const bodyParser = require('body-parser');

connectDb();

const supplierRoutes = require('./routes/suppliers');
const materialRoutes = require('./routes/materials');
const supplyRoutes = require('./routes/supplies');
const orderRoutes = require("./routes/order");
const batchRoutes = require('./routes/batch');
const machineRoutes = require('./routes/machine');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/suppliers', supplierRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/supplies', supplyRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/machine-usage', batchRoutes);
app.use('/api/machines', machineRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Briquette Manufacturing API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
